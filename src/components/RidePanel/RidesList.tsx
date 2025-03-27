import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Tooltip,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Slider,
  Stack,
} from "@mui/material";
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { rideApi } from "../../services/api/endpoints/rideApi";
import { notificationApi } from "../../services/api/endpoints/notificationApi";
import { useAuth } from "../../context/auth";
import { useRide } from "../../context/ride/RideContext";
import { useTheme } from "@mui/material/styles";
import { Ride, RideRequest } from "../../services/models/rideTypes";

interface RidesListProps {
  type: "available" | "driver" | "rider" | "requests";
  onSelectRide?: (ride: Ride) => void;
  filter?: "pending" | "accepted" | "rejected";
  refreshTrigger?: number; // Add this prop to trigger refreshes
}

const RidesList: React.FC<RidesListProps> = ({
  type,
  onSelectRide,
  filter,
  refreshTrigger = 0,
}) => {
  const { userProfile } = useAuth();
  const {
    selectedRide,
    selectRide,
    selectedRequest,
    selectRequest,
    userCommute,
  } = useRide();
  const theme = useTheme();
  const [rides, setRides] = useState<Ride[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState<number>(1000);

  

  const isRideSelected = (ride: Ride) => selectedRide?.rideId === ride.rideId;
  const isRequestSelected = (request: RideRequest) =>
    selectedRequest?.requestId === request.requestId;

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance/1000).toFixed(1)}km`;
  };

  // Get ride distance from userCommute.rides_distances
  const getRideDistance = (rideId: string) => {
    if (!userCommute?.ride_distances) return null;

    const distanceInfo = userCommute.ride_distances.find(
      (d) => d.ride_id === rideId
    );

    return distanceInfo?.distance || null;
  };

  const selectedItemStyle = {
    border: "2px solid",
    borderColor: "primary.main",
    borderRadius: "4px",
    mb: 1,
    bgcolor: "action.selected",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.id) return;

      setLoading(true);
      try {
        switch (type) {
          case "available":
            const availableRides = await rideApi.getAvailableRides(maxDistance/1000);
            setRides(availableRides);
            break;

          case "driver":
            const driverRides = await rideApi.getDriverRides(userProfile.id);
            setRides(driverRides);
            break;

          case "rider":
            const riderRides = await rideApi.getRiderRides(userProfile.id);
            setRides(riderRides);
            break;

          case "requests":
            if (userProfile.userType === "rider") {
              // Get requests made by this rider
              const riderRequests = await rideApi.getRiderRequests(
                userProfile.id
              );
              // Filter by status if needed
              setRequests(
                filter
                  ? riderRequests.filter((req) => req.status === filter)
                  : riderRequests
              );
            } else if (userProfile.userType === "driver") {
              // Get requests for this driver's rides
              const driverRequests = await rideApi.getDriverRequests(
                userProfile.id
              );
              // Filter by status if needed
              setRequests(
                filter
                  ? driverRequests.filter((req) => req.status === filter)
                  : driverRequests
              );
            }
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, userProfile?.id, filter, userProfile?.userType, refreshTrigger, maxDistance]);

  const handleApproveRequest = async (
    requestId: string,
    request: RideRequest
  ) => {
    try {
      await rideApi.approveRideRequest(requestId);

      // Send notification to the rider
      await notificationApi.sendNotification({
        userId: request.riderId,
        title: "Ride Request Approved",
        body: `Your ride request from ${request.pickupLocation?.address} has been approved!`,
        data: {
          type: "request_update",
          requestId: requestId,
          status: "accepted",
        },
      });

      // Refresh the list after approval
      if (userProfile?.id) {
        const updatedRequests = await rideApi.getDriverRequests(userProfile.id);
        setRequests(
          filter
            ? updatedRequests.filter((req) => req.status === filter)
            : updatedRequests
        );
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (
    requestId: string,
    request: RideRequest
  ) => {
    try {
      await rideApi.rejectRideRequest(requestId);

      // Send notification to the rider
      await notificationApi.sendNotification({
        userId: request.riderId,
        title: "Ride Request Rejected",
        body: `Your ride request from ${request.pickupLocation?.address} has been rejected.`,
        data: {
          type: "request_update",
          requestId: requestId,
          status: "rejected",
        },
      });
      // Refresh the list after rejection
      if (userProfile?.id) {
        const updatedRequests = await rideApi.getDriverRequests(userProfile.id);
        setRequests(
          filter
            ? updatedRequests.filter((req) => req.status === filter)
            : updatedRequests
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const getStatusChip = (status: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning" = "default";

    switch (status) {
      case "pending":
        color = "warning";
        break;
      case "accepted":
        color = "success";
        break;
      case "rejected":
        color = "error";
        break;
    }

    return <Chip label={status.toUpperCase()} color={color} size="small" />;
  };

  const TruncatedAddress = ({ label, address }: { label: string, address?: string }) => (
    <Tooltip title={address || "Unknown address"} placement="top">
      <Typography
        component="span"
        variant="body2"
        display="block"
        noWrap
        sx={{ maxWidth: '230px' }}
      >
        {label}: {address || "Unknown address"}
      </Typography>
    </Tooltip>
  );

  const DistanceFilter = () => (
    <Box 
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        mb: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        <FilterAltIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Maximum Walking Distance
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Slider
          value={maxDistance}
          onChange={(_, newValue) => setMaxDistance(newValue as number)}
          min={100}
          max={5000}
          step={100}
          aria-labelledby="max-walking-distance-slider"
          sx={{ flexGrow: 1 }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value < 1000 ? value : (value/1000).toFixed(1)}${value < 1000 ? 'm' : 'km'}`}
        />
        <TextField
          value={maxDistance}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 100 && value <= 2000) {
              setMaxDistance(value);
            }
          }}
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          inputProps={{
            min: 100,
            max: 2000,
            step: 100,
            type: 'number',
            'aria-labelledby': 'max-walking-distance-input',
          }}
          sx={{ 
            width: '150px',
            '& .MuiOutlinedInput-root': {
              paddingRight: '8px'
            },
            '& input': {
              paddingRight: '2px'
            }
          }}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Shows rides with walking distances less than {maxDistance < 1000 ? maxDistance + 'm' : (maxDistance/1000).toFixed(1) + 'km'}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (type === "requests") {
    if (requests.length === 0) {
      return (
        <Typography variant="body1" sx={{ p: 2 }}>
          No requests found.
        </Typography>
      );
    }

    return (
      <List>
        {requests.map((request) => (
          <React.Fragment key={request.requestId}>
            <ListItem
              alignItems="flex-start"
              onClick={() => selectRequest(request)}
              sx={{
                cursor: "pointer",
                ...(isRequestSelected(request) ? selectedItemStyle : {}),
              }}
              secondaryAction={
                userProfile?.userType === "driver" &&
                request.status === "pending" ? (
                  <Box onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        handleApproveRequest(request.requestId, request)
                      }
                      sx={{
                        mr: 1,
                        bgcolor: `${theme.palette.accent.main}`,
                        "&:hover": {
                          bgcolor: `${theme.palette.accent.dark}`,
                        },
                        color: `${theme.palette.accent.contrastText}`,
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        handleRejectRequest(request.requestId, request)
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                ) : (
                  getStatusChip(request.status)
                )
              }
            >
              <ListItemText
                primary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                <TruncatedAddress label="From" address={request.pickupLocation?.address} />
                  </Box>
                }
                secondary={
                  <>
                    <TruncatedAddress label="To" address={request.dropoffLocation?.address} />
                    <Typography
                      component="span"
                      variant="body2"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Requested: {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  }
  // Regular rides list (available, driver, rider)
  return (
    <>
      {/* Show distance filter only for available rides */}
      {type === "available" && <DistanceFilter />}

      {rides.length === 0 ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          No rides found. {type === "available" && "Try increasing the maximum walking distance."}
        </Typography>
      ) : (
        <List>
          {rides.map((ride) => {
          // Get pre-calculated distance data for this ride
          const distanceData = getRideDistance(ride.rideId);
          
          return (
            <React.Fragment key={ride.rideId}>
              <ListItem
                alignItems="flex-start"
                onClick={() => {
                  selectRide(ride);
                }}
                sx={{
                  cursor: "pointer",
                  ...(isRideSelected(ride) ? selectedItemStyle : {}),
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        From: {ride.startLocation.address}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(ride.startTime).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        display="block"
                      >
                        To: {ride.endLocation.address}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Available Seats: {ride.availableSeats}/{ride.totalSeats}
                      </Typography>

                      {/* Display walking distances if available */}
                      {userCommute && userProfile?.userType === 'rider' && distanceData && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mt: 1, 
                            color: 'text.secondary',
                            flexWrap: 'wrap'
                          }}
                        >
                          <Tooltip title="Walking distance from your home to pickup">
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              <DirectionsWalkIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.info.main }} />
                              <Typography variant="body2" component="span">
                                Walking Distance: {formatDistance(distanceData)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                    </>
                  }
                  slotProps={{ secondary: { component: "div" } }}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
      )}

      {type === "available" && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedRide}
            onClick={() => {
              if (selectedRide && onSelectRide) {
                onSelectRide(selectedRide);
              }
            }}
            sx={{
              minWidth: "200px",
              width: "100%",
              bgcolor: `${theme.palette.accent.main}`,
              "&:hover": {
                bgcolor: `${theme.palette.accent.dark}`,
              },
              color: `${theme.palette.accent.contrastText}`,
            }}
          >
            {selectedRide ? "Request Selected Ride" : "Select a Ride"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default RidesList;
