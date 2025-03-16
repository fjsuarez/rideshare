import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/auth';
import { userApi } from '../../../services/api/endpoints/userApi';

export interface ExistingUserData {
  userType?: 'rider' | 'driver';
  isDriver?: boolean;
  onboardingCompleted?: boolean;
  driverDetails?: {
    licenseNumber: string;
    isActive: boolean;
    vehicles: Array<VehicleDetails & { vehicleId: string }>;
  };
}

interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
}

export const useOnboardingForm = (onComplete: () => void, existingUserData?: ExistingUserData) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isDriver, setIsDriver] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<'rider' | 'driver' | null>(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails & { vehicleId?: string }>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    capacity: 4
  });
  const [isDriverActive, setIsDriverActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { refreshUserProfile } = useAuth();

  // Pre-populate form with existing user data
  useEffect(() => {
    if (existingUserData?.onboardingCompleted) {
      setIsUpdateMode(true);
      
      if (existingUserData.userType) {
        setUserType(existingUserData.userType);
      }
      
      if (existingUserData.isDriver !== undefined) {
        setIsDriver(existingUserData.isDriver);
      }
      
      if (existingUserData.driverDetails) {
        setLicenseNumber(existingUserData.driverDetails.licenseNumber);
        setIsDriverActive(existingUserData.driverDetails.isActive);
        
        // Get the first vehicle to populate the form
        if (existingUserData.driverDetails.vehicles?.length > 0) {
          const vehicle = existingUserData.driverDetails.vehicles[0];
          setVehicleDetails({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
            capacity: vehicle.capacity,
            vehicleId: vehicle.vehicleId // Preserve the vehicle ID
          });
        }
      }
    }
  }, [existingUserData]);

  const handleUserTypeChange = (_: React.MouseEvent<HTMLElement>, newUserType: 'rider' | 'driver' | null) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      // Also update the isDriver value for backward compatibility
      setIsDriver(newUserType === 'driver');
      setError(null);
    }
  };

  const updateVehicleDetails = (field: keyof VehicleDetails, value: string | number) => {
    setVehicleDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = () => {
    if (activeStep === 0 && userType === null) {
      setError('Please select a user type');
      return false;
    }

    if (activeStep === 1 && (userType === 'driver')) {
      if (!licenseNumber.trim()) {
        setError('Please enter your driver license number');
        return false;
      }
      
      if (!vehicleDetails.make.trim() || !vehicleDetails.model.trim() || !vehicleDetails.licensePlate.trim()) {
        setError('Please complete all vehicle information');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (activeStep < 1) {
      setActiveStep(prev => prev + 1);
      setError(null);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const isDriverUser = userType === 'driver';
      
      let requestData: any = { 
        isDriver: isDriverUser,
        userType: userType
      };

      // Add driver details if the user wants to be a driver
      if (isDriverUser) {
        requestData.driverDetails = {
          licenseNumber,
          vehicles: [
            {
              // Use existing vehicleId if in update mode, otherwise create a new one
              vehicleId: vehicleDetails.vehicleId || crypto.randomUUID(),
              make: vehicleDetails.make,
              model: vehicleDetails.model,
              year: vehicleDetails.year,
              licensePlate: vehicleDetails.licensePlate,
              capacity: vehicleDetails.capacity
            }
          ],
          isActive: isDriverActive
        };
      }

      // Use update endpoint if in update mode, otherwise complete onboarding
      if (isUpdateMode) {
        console.log('Update Mode');
        await userApi.updateProfile(requestData);
      } else {
        console.log('Onboarding Mode');
        await userApi.completeOnboarding(requestData);
      }
      
      // Refresh user profile to get updated data
      try {
        await refreshUserProfile();
      } catch (refreshError) {
        console.error('Error refreshing profile:', refreshError);
        // Continue execution even if refresh fails
      }
      onComplete();
    } catch (err: any) {
      console.error(isUpdateMode ? 'Profile update error:' : 'Onboarding error:', err);
      setError(err?.message || `An error occurred during ${isUpdateMode ? 'profile update' : 'onboarding'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    isDriver,
    userType,
    licenseNumber,
    vehicleDetails,
    isDriverActive,
    loading,
    error,
    isUpdateMode,
    handleNext,
    handleBack,
    handleUserTypeChange,
    setLicenseNumber,
    updateVehicleDetails,
    setIsDriverActive
  };
};