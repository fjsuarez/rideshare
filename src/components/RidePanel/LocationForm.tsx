import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, CircularProgress, Alert, 
  Typography, Paper
} from '@mui/material';
import { useAuth } from '../../context/auth';
import { rideApi } from '../../services/api/endpoints/rideApi';
import { Commute, Location } from '../../services/models/rideTypes';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface LocationFormProps {
  initialCommute?: Commute | null;
  onSuccess: (commute: Commute) => void;
}

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
        componentRestrictions: { country: 'es' }
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

const LocationFormContent = ({ initialCommute, onSuccess }: LocationFormProps) => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Add state for storing location coordinates
  const [homeLocation, setHomeLocation] = useState<Location | null>(null);
  const [workLocation, setWorkLocation] = useState<Location | null>(null);

  useEffect(() => {
    // If we have an initialCommute, populate the form
    if (initialCommute) {
      setHomeAddress(initialCommute.startLocation.address);
      setWorkAddress(initialCommute.endLocation.address);
      setHomeLocation(initialCommute.startLocation);
      setWorkLocation(initialCommute.endLocation);
    }
  }, [initialCommute]);

  const handleHomePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setHomeLocation({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address || homeAddress
      });
      console.log(place);
    }
  };

  const handleWorkPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setWorkLocation({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address || workAddress
      });
      console.log(place);
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
          latitude: Math.random() * 180 - 90,  // Mock latitude between -90 and 90
          longitude: Math.random() * 360 - 180, // Mock longitude between -180 and 180
          address: address
        };
      };

      let savedCommute: Commute;
      if (initialCommute) {
        savedCommute = {
          ...initialCommute,
          startLocation: createLocation(homeAddress, homeLocation),
          endLocation: createLocation(workAddress, workLocation),
          updatedAt: new Date().toISOString()
        };
        await rideApi.updateCommute(savedCommute);
        setSuccess('Commute updated successfully!');
      } else {
        savedCommute = {
          commuteId: `commute_${uuidv4()}`,
          userId: userProfile?.id || '',
          startLocation: createLocation(homeAddress, homeLocation),
          endLocation: createLocation(workAddress, workLocation),
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
        <AddressAutocomplete
          label="Home Location"
          value={homeAddress}
          onChange={setHomeAddress}
          onPlaceSelect={handleHomePlaceSelect}
          placeholder="Enter your home address"
        />
        
        <AddressAutocomplete
          label="Work Location"
          value={workAddress}
          onChange={setWorkAddress}
          onPlaceSelect={handleWorkPlaceSelect}
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

const LocationForm: React.FC<LocationFormProps> = (props) => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <LocationFormContent {...props} />
    </APIProvider>
  );
};

export default LocationForm;