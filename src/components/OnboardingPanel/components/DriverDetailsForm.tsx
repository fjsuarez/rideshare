import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
}

interface DriverDetailsFormProps {
  licenseNumber: string;
  vehicleDetails: VehicleDetails;
  isDriverActive: boolean;
  setLicenseNumber: React.Dispatch<React.SetStateAction<string>>;
  updateVehicleDetails: (field: keyof VehicleDetails, value: string | number) => void;
  setIsDriverActive: (value: boolean) => void;
}

const DriverDetailsForm: React.FC<DriverDetailsFormProps> = ({
  licenseNumber,
  vehicleDetails,
  setLicenseNumber,
  updateVehicleDetails,
}) => {
  const handleVehicleFieldChange = (field: keyof VehicleDetails) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' 
      ? parseInt(e.target.value)
      : e.target.value;
    updateVehicleDetails(field, value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Driver Details
      </Typography>
      
      <TextField
        label="Driver's License Number"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        margin="normal"
        required
      />
      
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Vehicle Information
      </Typography>
      
      <TextField
        label="Vehicle Make"
        value={vehicleDetails.make}
        onChange={handleVehicleFieldChange('make')}
        margin="normal"
        required
      />
      
      <TextField
        label="Vehicle Model"
        value={vehicleDetails.model}
        onChange={handleVehicleFieldChange('model')}
        margin="normal"
        required
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Year"
          type="number"
          value={vehicleDetails.year}
          onChange={handleVehicleFieldChange('year')}
          margin="normal"
          required
          sx={{ flex: 1 }}
        />
        
        <TextField
          label="License Plate"
          value={vehicleDetails.licensePlate}
          onChange={handleVehicleFieldChange('licensePlate')}
          margin="normal"
          required
          sx={{ flex: 1 }}
        />
        
        <TextField
          label="Capacity"
          type="number"
          value={vehicleDetails.capacity}
          onChange={handleVehicleFieldChange('capacity')}
          margin="normal"
          required
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default DriverDetailsForm;