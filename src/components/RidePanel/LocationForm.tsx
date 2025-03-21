import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, CircularProgress, Alert, 
  Typography, Paper
} from '@mui/material';
import { useAuth } from '../../context/auth';
import { rideApi } from '../../services/api/endpoints/rideApi';
import { Commute, Location } from '../../services/models/rideTypes';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

interface LocationFormProps {
  initialCommute?: Commute | null;
  onSuccess: (commute: Commute) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ initialCommute, onSuccess }) => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // If we have an initialCommute, populate the form
    if (initialCommute) {
      setHomeAddress(initialCommute.startLocation.address);
      setWorkAddress(initialCommute.endLocation.address);
    }
  }, [initialCommute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const createLocation = (address: string): Location => ({
        latitude: Math.random() * 180 - 90,  // Mock latitude between -90 and 90
        longitude: Math.random() * 360 - 180, // Mock longitude between -180 and 180
        address: address
      });
      let savedCommute: Commute;
      if (initialCommute) {
        savedCommute = {
          ...initialCommute,
          startLocation: createLocation(homeAddress),
          endLocation: createLocation(workAddress),
          updatedAt: new Date().toISOString()
        };
        await rideApi.updateCommute(savedCommute);
        setSuccess('Commute updated successfully!');
      } else {
        savedCommute = {
          commuteId: `commute_${uuidv4()}`,
          userId: userProfile?.id || '',
          startLocation: createLocation(homeAddress),
          endLocation: createLocation(workAddress),
          preferredStartTime: new Date().toISOString(), // Default times
          preferredEndTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await rideApi.createCommute(savedCommute);
        setSuccess('Commute created successfully!');
      }   
      onSuccess(savedCommute);
    } catch (err) {
      console.error('Failed to save commute:', err);
      setError('Failed to save commute information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        {initialCommute ? 'Update Your Commute' : 'Create Your Commute'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Home Location"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your home address"
        />
        
        <TextField
          label="Work Location"
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your work address"
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
          sx={{ mt: 2,
            bgcolor: `${theme.palette.accent.main}`,
            "&:hover": {
              bgcolor: `${theme.palette.accent.dark}`,
            },
            color: `${theme.palette.accent.contrastText}`,
           }}
        >
          {loading ? <CircularProgress size={24} /> : initialCommute ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LocationForm;