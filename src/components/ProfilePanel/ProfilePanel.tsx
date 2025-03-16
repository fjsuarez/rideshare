import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useAuth } from '../../context/auth';
import OnboardingPanel from '../OnboardingPanel/OnboardingPanel';
import ProfileHeader from './components/ProfileHeader';
import DriverDetails from './components/DriverDetails';
import ProfileActions from './components/ProfileActions';
import EmptyProfile from './components/EmptyProfile';
import { ExistingUserData } from '../OnboardingPanel/hooks/useOnboardingForm';

const ProfilePanel: React.FC = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Handle empty profile state
  if (!userProfile) {
    return <EmptyProfile />;
  }

  // Check onboarding status safely with optional chaining
  const needsOnboarding = userProfile?.onboardingCompleted === false;
  
  // Format user profile data to match ExistingUserData interface
  const formatExistingUserData = (): ExistingUserData | undefined => {
    if (!userProfile) return undefined;
    
    const existingData: ExistingUserData = {
      userType: userProfile.userType as 'rider' | 'driver',
      isDriver: userProfile.userType === 'driver',
      onboardingCompleted: userProfile.onboardingCompleted
    };
    
    // Add driver details if available
    if (userProfile.driver) {
      existingData.driverDetails = {
        licenseNumber: userProfile.driver.licenseNumber || '',
        isActive: userProfile.driver.isActive ?? true,
        vehicles: userProfile.driver.vehicles?.map(vehicle => ({
          vehicleId: vehicle.vehicleId,
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          licensePlate: vehicle.licensePlate || '',
          capacity: vehicle.capacity || 4
        })) || []
      };
    }
    
    return existingData;
  };
  
  const handleOnboardingComplete = async () => {
    await refreshUserProfile();
    setShowOnboarding(false);
  };

  if (needsOnboarding || showOnboarding) {
    return (
      <OnboardingPanel 
        onComplete={handleOnboardingComplete} 
        existingUserData={formatExistingUserData()} 
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* User basic info */}
          <ProfileHeader userProfile={userProfile} />
          
          {/* Driver-specific information - with safe property access */}
          {userProfile?.userType === 'driver' && userProfile?.driver && (
            <DriverDetails driverDetails={userProfile.driver} />
          )}
          
          {/* Profile actions */}
          <ProfileActions onEditProfile={() => setShowOnboarding(true)} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePanel;