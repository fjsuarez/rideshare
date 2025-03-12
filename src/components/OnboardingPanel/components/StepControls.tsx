import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

interface StepControlsProps {
  activeStep: number;
  isLastStep: boolean;
  isStepValid: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

const StepControls: React.FC<StepControlsProps> = ({
  activeStep,
  isLastStep,
  isStepValid,
  loading,
  onBack,
  onNext
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Button
        disabled={activeStep === 0 || loading}
        onClick={onBack}
        sx={{ 
          bgcolor: theme.palette.accent.main,
          '&:hover': {
            bgcolor: theme.palette.accent.dark,
          },
          color: theme.palette.accent.contrastText,
        }}
      >
        Back
      </Button>
      <Button
        variant="outlined"
        onClick={onNext}
        disabled={loading || !isStepValid}
        sx={{ 
          bgcolor: theme.palette.accent.main,
          '&:hover': {
            bgcolor: theme.palette.accent.dark,
          },
          color: theme.palette.accent.contrastText,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isLastStep ? 'Complete' : 'Next'}
      </Button>
    </Box>
  );
};

export default StepControls;