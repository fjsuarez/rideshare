import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { useOnboardingForm, ExistingUserData } from './hooks/useOnboardingForm';
import { useTheme } from '@mui/material/styles';
import UserTypeSelector from './components/UserTypeSelector';
import DriverDetailsForm from './components/DriverDetailsForm';
import RiderConfirmation from './components/RiderConfirmation';
import OnboardingHeader from './components/OnboardingHeader';
import StepControls from './components/StepControls';

const steps = ['Select User Type', 'Additional Information'];

interface OnboardingPanelProps {
  onComplete: () => void;
  existingUserData?: ExistingUserData;
}

const OnboardingPanel: React.FC<OnboardingPanelProps> = ({ onComplete, existingUserData }) => {
  const theme = useTheme();
  const { 
    activeStep,
    userType,
    licenseNumber,
    vehicleDetails,
    isDriverActive,
    loading,
    error,
    handleNext,
    handleBack,
    handleUserTypeChange,
    setLicenseNumber,
    updateVehicleDetails,
    setIsDriverActive
  } = useOnboardingForm(onComplete, existingUserData);

  const isDriver = userType === 'driver';

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <UserTypeSelector 
            userType={userType} 
            onChange={handleUserTypeChange} 
          />
        );
      case 1:
        if (isDriver) {
          return (
            <>
              <DriverDetailsForm
                licenseNumber={licenseNumber}
                vehicleDetails={vehicleDetails}
                isDriverActive={isDriverActive}
                setLicenseNumber={setLicenseNumber}
                updateVehicleDetails={updateVehicleDetails}
                setIsDriverActive={setIsDriverActive}
              />
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Driver Availability
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDriverActive}
                      onChange={(e) => setIsDriverActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={isDriverActive ? "Available to accept rides" : "Not available for rides"}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Toggle your availability to accept ride requests
                </Typography>
              </Box>
            </>
          );
        } else {
          return <RiderConfirmation />;
        }
      default:
        return null;
    }
  };

  return (
    <Card sx={{ maxWidth: 600, width: '100%', margin: '0 auto' }}>
      <CardContent>
        {/* Header */}
        <OnboardingHeader />

        {/* Error display */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Steps indicator */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Content for current step */}
        <Box sx={{ minHeight: 200 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation controls */}
        <StepControls
          activeStep={activeStep}
          isLastStep={activeStep === steps.length - 1}
          isStepValid={activeStep === 0 ? userType !== null : true}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
};

export default OnboardingPanel;