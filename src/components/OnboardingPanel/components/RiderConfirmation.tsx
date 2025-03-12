import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

const RiderConfirmation: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', 
      p: 2,
      minHeight: 200
    }}>
      <CheckCircleIcon 
        sx={{ 
          fontSize: 60, 
          color: theme.palette.accent.main, 
          mb: 2 
        }} 
      />
      <Typography variant="h6" gutterBottom>
        You're all set!
      </Typography>
      <Typography variant="body1" align="center">
        Click complete to finish your onboarding.
      </Typography>
    </Box>
  );
};

export default RiderConfirmation;