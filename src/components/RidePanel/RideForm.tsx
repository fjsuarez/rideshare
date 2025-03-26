import React, { useState, useEffect, useRef } from 'react';
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
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';

interface RideFormProps {
  initialRide?: Ride | null;
  onSuccess: (ride: Ride) => void;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const AddressAutocomplete = ({ 
  label, 
  value, 
  onChange, 
  onPlaceSelect,
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary('places');
  
  // Store the latest callbacks in refs to avoid dependency issues
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  
  // Update refs when props change
  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onChange, onPlaceSelect]);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    
    // Only create autocomplete if it doesn't exist yet
    if (!autocompleteRef.current) {
      const options = {
        fields: ['address_components', 'geometry', 'formatted_address'],
        types: ['address'],
        componentRestrictions: { country: 'es',}
      };

      autocompleteRef.current = new places.Autocomplete(inputRef.current, options);
      
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          onChangeRef.current(place.formatted_address);
          onPlaceSelectRef.current(place);
        }
      });

      return () => {
        if (places && autocompleteRef.current) {
          google.maps.event.removeListener(listener);
          autocompleteRef.current = null;
        }
      };
    }
  }, [places]); // Only depend on places library

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      required
      margin="normal"
      placeholder={placeholder}
      inputRef={inputRef}
    />
  );
};

const RideFormContent = ({ initialRide, onSuccess }: RideFormProps) => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [departureTime, setDepartureTime] = useState<Date | null>(new Date());
  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Add state for storing location coordinates
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);

  const maxSeats = userProfile?.driver?.vehicles[0]?.capacity;

  useEffect(() => {
    // If we have an initialRide, populate the form
    if (initialRide) {
      setStartAddress(initialRide.startLocation.address);
      setEndAddress(initialRide.endLocation.address);
      setDepartureTime(new Date(initialRide.startTime));
      setTotalSeats(initialRide.totalSeats);
      setStartLocation(initialRide.startLocation);
      setEndLocation(initialRide.endLocation);
    }
  }, [initialRide]);

  const handleStartPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setStartLocation({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address || startAddress
      });
    }
  };

  const handleEndPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setEndLocation({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address || endAddress
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const createLocation = (address: string, location?: Location | null): Location => {
        if (location) {
          return location;
        }
        // Fallback to mock coordinates if no real location is available
        return {
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180,
          address: address
        };
      };

      let savedRide: Ride;
      
      if (initialRide) {
        // Update existing ride
        savedRide = {
          ...initialRide,
          startLocation: createLocation(startAddress, startLocation),
          endLocation: createLocation(endAddress, endLocation),
          startTime: departureTime?.toISOString() || new Date().toISOString(),
          totalSeats: totalSeats,
          availableSeats: totalSeats, // This might need logic to preserve existing bookings
          updatedAt: new Date().toISOString()
        };

        console.log('Updating ride:', savedRide);
        
        await rideApi.updateRide(savedRide);
        setSuccess('Ride updated successfully!');
      } else {
        // Create new ride
        const startDate = departureTime ?? new Date();
        const endDate = new Date(startDate.getTime() + 3600000);
        savedRide = {
          rideId: `ride_${uuidv4()}`,
          driverId: userProfile?.id || '',
          startLocation: createLocation(startAddress, startLocation),
          endLocation: createLocation(endAddress, endLocation),
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
        <AddressAutocomplete
          label="Starting Location"
          value={startAddress}
          onChange={setStartAddress}
          onPlaceSelect={handleStartPlaceSelect}
          placeholder="Enter your pickup location"
        />
        
        <AddressAutocomplete
          label="Destination"
          value={endAddress}
          onChange={setEndAddress}
          onPlaceSelect={handleEndPlaceSelect}
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
            {Array.from({ length: maxSeats || 0 }, (_, i) => i + 1).map((num) => (
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

const RideForm: React.FC<RideFormProps> = (props) => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <RideFormContent {...props} />
    </APIProvider>
  );
};

export default RideForm;