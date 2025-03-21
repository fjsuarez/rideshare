import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { rideApi } from "../../services/api/endpoints/rideApi";
import { useAuth } from "../../context/auth";
import { useRide } from "../../context/ride/RideContext";
import { useTheme } from "@mui/material/styles";
import { Ride, RideRequest } from "../../services/models/rideTypes";

interface RidesListProps {
  type: "available" | "driver" | "rider" | "requests";
  onSelectRide?: (ride: Ride) => void;
  filter?: "pending" | "accepted" | "rejected";
}

const RidesList: React.FC<RidesListProps> = ({
  type,
  onSelectRide,
  filter,
}) => {
  const { userProfile } = useAuth();
  const { selectedRide, selectRide, selectedRequest, selectRequest } =
    useRide();
  const theme = useTheme();
  const [rides, setRides] = useState<Ride[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const isRideSelected = (ride: Ride) => selectedRide?.rideId === ride.rideId;
  const isRequestSelected = (request: RideRequest) =>
    selectedRequest?.requestId === request.requestId;

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
            const availableRides = await rideApi.getAvailableRides();
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
  }, [type, userProfile?.id, filter, userProfile?.userType]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      await rideApi.approveRideRequest(requestId);
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

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rideApi.rejectRideRequest(requestId);
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
                      onClick={() => handleApproveRequest(request.requestId)}
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
                      onClick={() => handleRejectRequest(request.requestId)}
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
                    <Typography variant="subtitle1">
                      From: {request.pickupLocation.address}
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
                      To: {request.dropoffLocation.address}
                    </Typography>
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
  if (rides.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        No rides found.
      </Typography>
    );
  }

  return (
    <>
      <List>
        {rides.map((ride) => (
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
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

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
