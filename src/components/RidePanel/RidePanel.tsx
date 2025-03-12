import React, { useState } from 'react';
import { 
  Box, Tabs, Tab, Typography, Paper, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import LocationForm from './LocationForm';
import RidesList from './RidesList';
import { useAuth } from '../../context/auth';
import { Ride, RideRequest, rideApi } from '../../services/api/endpoints/rideApi';
import { v4 as uuidv4 } from 'uuid';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RidePanel: React.FC = () => {
  const { userProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [commuteSetup, setCommuteSetup] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRideSelect = (ride: Ride) => {
    setSelectedRide(ride);
    setOpenRequestDialog(true);
  };

  const handleRequestRide = async () => {
    if (!selectedRide || !userProfile?.id) return;
    
    try {
      // In a real app, you'd get pickup/dropoff from user input
      // Here we're just using ride start/end locations
      const rideRequest: RideRequest = {
        requestId: `req_${uuidv4()}`,
        rideId: selectedRide.rideId,
        riderId: userProfile.id,
        status: 'pending',
        pickupLocation: selectedRide.startLocation,
        dropoffLocation: selectedRide.endLocation,
        createdAt: new Date().toISOString()
      };
      
      await rideApi.requestRide(rideRequest);
      setOpenRequestDialog(false);
      // Show success message or refresh list
    } catch (error) {
      console.error('Error requesting ride:', error);
      // Show error message
    }
  };

  const handleCommuteSetupComplete = () => {
    setCommuteSetup(true);
  };

  return (
    <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {!commuteSetup ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Set Up Your Commute
          </Typography>
          <Typography variant="body1" gutterBottom>
            Before you can find or offer rides, please set up your commute details.
          </Typography>
          <LocationForm onSuccess={handleCommuteSetupComplete} />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="ride tabs">
              <Tab label="Available Rides" />
              <Tab label="My Rides as Driver" />
              <Tab label="My Rides as Rider" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <RidesList type="available" onSelectRide={handleRideSelect} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RidesList type="driver" />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <RidesList type="rider" />
          </TabPanel>
        </>
      )}

      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)}>
        <DialogTitle>Request Ride</DialogTitle>
        <DialogContent>
          {selectedRide && (
            <>
              <Typography variant="h6">
                From: {selectedRide.startLocation.address}
              </Typography>
              <Typography variant="h6">
                To: {selectedRide.endLocation.address}
              </Typography>
              <Typography variant="body1">
                Available seats: {selectedRide.availableSeats}/{selectedRide.totalSeats}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleRequestRide} variant="contained">Request Ride</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RidePanel;