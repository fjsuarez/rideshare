import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, CircularProgress, Alert, 
  Typography, Paper
} from '@mui/material';
import { useAuth } from '../../context/auth';
import { rideApi, Commute, Location } from '../../services/api/endpoints/rideApi';
import { v4 as uuidv4 } from 'uuid';

interface LocationFormProps {
  onSuccess: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onSuccess }) => {
  const { userProfile } = useAuth();
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingCommute, setExistingCommute] = useState<Commute | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCommute = async () => {
      if (!userProfile?.id) return;
      
      try {
        const commutes = await rideApi.getCommutes();
        
        if (commutes && commutes.length > 0) {
          const userCommute = commutes[0]; // Take the first commute
          setExistingCommute(userCommute);
          setHomeAddress(userCommute.startLocation.address);
          setWorkAddress(userCommute.endLocation.address);
        }
      } catch (err) {
        console.error('Failed to fetch commute:', err);
      }
    };

    if (userProfile?.id) {
      fetchUserCommute();
    }
  }, [userProfile?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Mock coordinates for demonstration - in a real app, you would use a geocoding service
      const createLocation = (address: string): Location => ({
        latitude: Math.random() * 180 - 90,  // Mock latitude between -90 and 90
        longitude: Math.random() * 360 - 180, // Mock longitude between -180 and 180
        address: address
      });

      if (existingCommute) {
        // Currently no update endpoint for commutes in the backend
        // Would need to implement this in the backend first
        // For now, we'll create a new commute with the updated info
        await rideApi.createCommute({
          ...existingCommute,
          startLocation: createLocation(homeAddress),
          endLocation: createLocation(workAddress),
          updatedAt: new Date().toISOString()
        });
        setSuccess('Commute updated successfully!');
      } else {
        const commute: Commute = {
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
        
        await rideApi.createCommute(commute);
        setExistingCommute(commute);
        setSuccess('Commute created successfully!');
      }
      onSuccess();
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
        {existingCommute ? 'Update Your Commute' : 'Create Your Commute'}
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
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : existingCommute ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LocationForm;