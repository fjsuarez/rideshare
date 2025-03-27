import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CommuteForm from "./CommuteForm";
import RideForm from "./RideForm";
import CommuteInfo from "./CommuteInfo";
import RideInfo from "./RideInfo";
import RidesList from "./RidesList";
import { useAuth } from "../../context/auth";
import { useRide } from "../../context/ride/RideContext";
import { rideApi } from "../../services/api/endpoints/rideApi";
import { Ride, RideRequest, Commute } from "../../services/models/rideTypes";
import { v4 as uuidv4 } from "uuid";
import TabPanel from "./TabPanel";
import { useSnackbar, SnackbarKey } from "notistack";
import { messaging } from "../../firebase";
import { onMessage } from "firebase/messaging";

const RidePanel: React.FC = () => {
  const { userProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [commute, setCommute] = useState<Commute | null>(null);
  const [driverRide, setDriverRide] = useState<Ride | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<"rider" | "driver" | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { selectRide, userCommute } = useRide();

  useEffect(() => {
    if (userProfile) {
      setUserRole(userProfile.userType);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userProfile?.id) return;

      try {
        setIsLoading(true);

        if (userRole === "rider") {
          // Fetch commute data for riders
          const commutes = await rideApi.getCommutes();

          if (commutes && commutes.length > 0) {
            setCommute(commutes[0]);
            setIsEditMode(false);
          } else {
            setIsEditMode(true);
          }
        } else if (userRole === "driver") {
          // Fetch ride data for drivers
          const rides = await rideApi.getDriverRides(userProfile.id);
          if (rides && rides.length > 0) {
            setDriverRide(rides[0]); // Just get the first ride for simplicity
            setIsEditMode(false);
          } else {
            setIsEditMode(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsEditMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole) {
      fetchUserData();
    }
  }, [userProfile?.id, userRole]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);

      setRefreshTrigger((prev) => prev + 1);

      const action = (snackbarId: SnackbarKey) => (
        <>
          <Button
            sx={{ color: "accent.contrastText" }}
            onClick={() => {
              console.log("userRole is", userProfile?.userType);
              const tab = userProfile?.userType === "rider" ? 1 : 0;
              console.log("Opening tab", tab);
              handleTabChange(null, tab);
              if (payload.data?.rideId) {
                rideApi.getRideById(payload.data.rideId).then((ride) => {
                  selectRide(ride);
                });
              } else {
                console.warn("No ride ID in notification payload");
              }
              
              closeSnackbar(snackbarId);
            }}
          >
            View
          </Button>
          <Button
            sx={{ color: "accent.dark" }}
            onClick={() => {
              closeSnackbar(snackbarId);
            }}
          >
            Dismiss
          </Button>
        </>
      );
      enqueueSnackbar(payload?.notification?.body, { action });
    });

    return () => {
      unsubscribe();
    };
  }, [userProfile?.userType]);

  const handleTabChange = (
    _event: React.SyntheticEvent | null,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleRideSelect = (ride: Ride) => {
    setSelectedRide(ride);
    setOpenRequestDialog(true);
  };

  const handleRequestRide = async () => {
    if (!selectedRide || !userProfile?.id) return;

    try {
      const rideDistanceData = userCommute?.ride_distances?.find(
        (rd) => rd.ride_id === selectedRide.rideId
      );
      if (!rideDistanceData) {
        console.error("Could not find matching ride distance data");
        return;
      }
      
      if (userCommute?.startLocation?.address) {
        rideDistanceData.entry_point.address = userCommute.startLocation.address;
      }
      
      if (userCommute?.endLocation?.address) {
        rideDistanceData.exit_point.address = userCommute.endLocation.address;
      }

      const rideRequest: RideRequest = {
        driverId: selectedRide.driverId,
        requestId: `req_${uuidv4()}`,
        rideId: selectedRide.rideId,
        riderId: userProfile.id,
        status: "pending",
        pickupLocation: rideDistanceData?.entry_point,
        dropoffLocation: rideDistanceData?.exit_point,
        createdAt: new Date().toISOString(),
      };

      await rideApi.requestRide(rideRequest);
      setOpenRequestDialog(false);
      handleTabChange(null, 1);
    } catch (error) {
      console.error("Error requesting ride:", error);
    }
  };

  const handleCommuteUpdated = (updatedCommute: Commute) => {
    setCommute(updatedCommute);
    setIsEditMode(false);
  };

  const handleEditCommute = () => {
    setIsEditMode(true);
  };

  const handleEditRide = () => {
    setIsEditMode(true);
  };

  if (isLoading) {
    return (
      <Paper
        sx={{ width: "100%", p: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", bgcolor: "background.paper" }}>
      {/* Commute Section for Riders */}
      {userRole === "rider" && (
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
          {isEditMode ? (
            <CommuteForm
              initialCommute={commute}
              onSuccess={handleCommuteUpdated}
            />
          ) : (
            commute && (
              <CommuteInfo commute={commute} onEdit={handleEditCommute} />
            )
          )}
        </Box>
      )}

      {/* Ride Info Section for Drivers */}
      {userRole === "driver" && (
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
          {isEditMode ? (
            <RideForm
              initialRide={driverRide}
              onSuccess={(updatedRide) => {
                setDriverRide(updatedRide);
                setIsEditMode(false);
              }}
            />
          ) : (
            driverRide && <RideInfo ride={driverRide} onEdit={handleEditRide} />
          )}
        </Box>
      )}

      {/* Ride Lists */}
      {(commute || userRole === "driver") && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="ride tabs"
            >
              {userRole === "rider"
                ? // Rider tabs
                  [
                    <Tab key="available" label="Available Rides" />,
                    <Tab key="requests" label="My Requests" />,
                    <Tab key="rides" label="My Rides" />,
                  ]
                : // Driver tabs
                  [
                    <Tab key="pending" label="Pending Requests" />,
                    <Tab key="drives" label="My Drives" />,
                  ]}
            </Tabs>
          </Box>

          {userRole === "rider" ? (
            // Rider tab panels
            <>
              <TabPanel value={tabValue} index={0}>
                <RidesList
                  type="available"
                  onSelectRide={handleRideSelect}
                  refreshTrigger={refreshTrigger}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <RidesList type="requests" refreshTrigger={refreshTrigger} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <RidesList type="rider" refreshTrigger={refreshTrigger} />
              </TabPanel>
            </>
          ) : (
            // Driver tab panels
            <>
              <TabPanel value={tabValue} index={0}>
                <RidesList
                  type="requests"
                  filter="pending"
                  refreshTrigger={refreshTrigger}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <RidesList type="driver" refreshTrigger={refreshTrigger} />
              </TabPanel>
            </>
          )}
        </>
      )}

      {/* Request Dialog */}
      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
      >
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
                Available seats: {selectedRide.availableSeats}/
                {selectedRide.totalSeats}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRequestRide}
            variant="contained"
            sx={{ bgcolor: "info.main", color: "white" }}
          >
            Request Ride
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RidePanel;
