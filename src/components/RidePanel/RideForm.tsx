import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, CircularProgress, Alert, 
  Typography, Paper, FormControl, InputLabel,
  Select, MenuItem
} from '@mui/material';
import { useAuth } from '../../context/auth';
import { rideApi } from '../../services/api/endpoints/rideApi';
import { Ride, Location } from '../../services/models/rideTypes';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

interface RideFormProps {
  initialRide?: Ride | null;
  onSuccess: (ride: Ride) => void;
}

const RideForm: React.FC<RideFormProps> = ({ initialRide, onSuccess }) => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [departureTime, setDepartureTime] = useState<Date | null>(new Date());
  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // If we have an initialRide, populate the form
    if (initialRide) {
      setStartAddress(initialRide.startLocation.address);
      setEndAddress(initialRide.endLocation.address);
      setDepartureTime(new Date(initialRide.startTime));
      setTotalSeats(initialRide.totalSeats);
    }
  }, [initialRide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const createLocation = (address: string): Location => ({
        latitude: Math.random() * 180 - 90,  // Mock latitude
        longitude: Math.random() * 360 - 180, // Mock longitude
        address: address
      });

      let savedRide: Ride;
      
      if (initialRide) {
        // Update existing ride
        savedRide = {
          ...initialRide,
          startLocation: createLocation(startAddress),
          endLocation: createLocation(endAddress),
          startTime: departureTime?.toISOString() || new Date().toISOString(),
          totalSeats: totalSeats,
          availableSeats: totalSeats, // This might need logic to preserve existing bookings
          updatedAt: new Date().toISOString()
        };
        
        await rideApi.updateRide(savedRide);
        setSuccess('Ride updated successfully!');
      } else {
        // Create new ride
        const startDate = departureTime ?? new Date();
        const endDate = new Date(startDate.getTime() + 3600000);
        savedRide = {
          rideId: `ride_${uuidv4()}`,
          driverId: userProfile?.id || '',
          startLocation: createLocation(startAddress),
          endLocation: createLocation(endAddress),
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          totalSeats: totalSeats,
          availableSeats: totalSeats,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await rideApi.createRide(savedRide);
        setSuccess('Ride created successfully!');
      }   
      
      onSuccess(savedRide);
    } catch (err) {
      console.error('Failed to save ride:', err);
      setError('Failed to save ride information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        {initialRide ? 'Update Your Ride' : 'Create a New Ride'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Starting Location"
          value={startAddress}
          onChange={(e) => setStartAddress(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your pickup location"
        />
        
        <TextField
          label="Destination"
          value={endAddress}
          onChange={(e) => setEndAddress(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your destination"
        />
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Departure Time"
            value={departureTime}
            onChange={(newValue) => setDepartureTime(newValue)}
            sx={{ mt: 2, mb: 1, width: '100%' }}
          />
        </LocalizationProvider>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="seats-label">Available Seats</InputLabel>
          <Select
            labelId="seats-label"
            value={totalSeats}
            label="Available Seats"
            onChange={(e) => setTotalSeats(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
          sx={{ 
            mt: 2,
            bgcolor: `${theme.palette.accent.main}`,
            "&:hover": {
              bgcolor: `${theme.palette.accent.dark}`,
            },
            color: `${theme.palette.accent.contrastText}`,
          }}
        >
          {loading ? <CircularProgress size={24} /> : initialRide ? 'Update Ride' : 'Create Ride'}
        </Button>
      </Box>
    </Paper>
  );
};

export default RideForm;