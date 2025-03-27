import React, { useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Ride } from '../../services/models/rideTypes';
import { useRide } from '../../context/ride/RideContext';
import { format } from 'date-fns';

interface RideInfoProps {
  ride: Ride;
  onEdit: () => void;
}

const RideInfo: React.FC<RideInfoProps> = ({ ride, onEdit }) => {
    const { setUserRide } = useRide();
    useEffect(() => {
      setUserRide(ride);
      console.log(ride);
      return () => setUserRide(null);
    }, [ride, setUserRide]);
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Your Ride</Typography>
          <IconButton onClick={onEdit} size="small">
            <EditIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">From</Typography>
            <Typography>{ride.startLocation.address}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">To</Typography>
            <Typography>{ride.endLocation.address}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Departure</Typography>
            <Typography>{format(new Date(ride.startTime), "EEE, MMM d, h:mm a")}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Seats Available</Typography>
            <Typography>{ride.availableSeats} of {ride.totalSeats}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RideInfo;