import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DriverDetails as DriverDetailsType } from '../../../services/models/userTypes';

interface DriverDetailsProps {
  driverDetails: DriverDetailsType | undefined;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driverDetails }) => {
  // Early return if no driver details
  if (!driverDetails) return null;

  // Safely check for vehicles
  const hasVehicles = driverDetails?.vehicles && driverDetails.vehicles.length > 0;
  const primaryVehicle = hasVehicles ? driverDetails.vehicles[0] : null;

  return (
    <Box mt={2} textAlign="center">
      <Typography variant="body2" fontWeight="bold">
        Driver's License
      </Typography>
      <Typography variant="body2">
        {driverDetails?.licenseNumber || 'Not provided'}
      </Typography>
      
      {primaryVehicle && (
        <Box mt={1}>
          <Typography variant="body2" fontWeight="bold">
            Vehicle
          </Typography>
          <Typography variant="body2">
            {primaryVehicle.make} {primaryVehicle.model} ({primaryVehicle.year})
          </Typography>
          <Typography variant="body2">
            License Plate: {primaryVehicle.licensePlate}
          </Typography>
          <Typography variant="body2">
            Capacity: {primaryVehicle.capacity} seats
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DriverDetails;