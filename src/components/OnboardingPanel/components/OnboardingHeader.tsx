import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const OnboardingHeader: React.FC = () => {
  const theme = useTheme();
  
  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to Ride<Box component="span" sx={{ color: theme.palette.accent.main }}>Share</Box>
      </Typography>
      <Typography variant="body1" align="center" gutterBottom sx={{ mb: 4 }}>
        Let's set up your profile to get started
      </Typography>
    </>
  );
};

export default OnboardingHeader;