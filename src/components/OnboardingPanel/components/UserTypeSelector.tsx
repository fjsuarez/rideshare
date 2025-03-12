import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';

interface UserTypeSelectorProps {
  userType: 'rider' | 'driver' | null;
  onChange: (event: React.MouseEvent<HTMLElement>, value: 'rider' | 'driver' | null) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ userType, onChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>
        How would you like to use RideShare?
      </Typography>
      
      <ToggleButtonGroup
        value={userType}
        exclusive
        onChange={onChange}
        aria-label="user type"
        sx={{ mt: 2, mb: 2 }}
      >
        <ToggleButton 
          value="rider" 
          aria-label="rider"
          sx={{ 
            p: 3, 
            border: userType === 'rider' ? `2px solid ${theme.palette.accent.main} !important` : undefined,
            borderWidth: userType === 'rider' ? 2 : 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PersonIcon fontSize="large" />
            <Typography sx={{ mt: 1 }}>I need a ride</Typography>
          </Box>
        </ToggleButton>

        <ToggleButton 
          value="driver" 
          aria-label="driver"
          sx={{ 
            p: 3, 
            border: userType === 'driver' ? `2px solid ${theme.palette.accent.main} !important` : undefined,
            borderWidth: userType === 'driver' ? 2 : 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DirectionsCarIcon fontSize="large" />
            <Typography sx={{ mt: 1 }}>I want to drive</Typography>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default UserTypeSelector;