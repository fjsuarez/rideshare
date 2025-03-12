import React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

interface DriverActiveToggleProps {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
}

const DriverActiveToggle: React.FC<DriverActiveToggleProps> = ({ isActive, onChange }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Driver Availability
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onChange={(e) => onChange(e.target.checked)}
            color="primary"
          />
        }
        label={isActive ? "Available to accept rides" : "Not available for rides"}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Toggle your availability to accept ride requests
      </Typography>
    </Box>
  );
};

export default DriverActiveToggle;