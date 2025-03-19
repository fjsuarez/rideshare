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
import { format } from "date-fns";
import { Ride } from "../../services/models/rideTypes";

interface RidesListProps {
  type: "available" | "driver" | "rider";
  onSelectRide?: (ride: Ride) => void;
}

const RidesList: React.FC<RidesListProps> = ({ type, onSelectRide }) => {
  const { userProfile } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      if (!userProfile?.id) return;

      setLoading(true);
      setError(null);

      try {
        let fetchedRides: Ride[] = [];

        switch (type) {
          case "available":
            fetchedRides = await rideApi.getAvailableRides();
            break;
          case "driver":
            fetchedRides = await rideApi.getDriverRides(userProfile.id);
            break;
          case "rider":
            fetchedRides = await rideApi.getRiderRides(userProfile.id);
            break;
        }

        setRides(fetchedRides);
      } catch (err) {
        console.error("Failed to fetch rides:", err);
        setError(`Failed to load ${type} rides.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userProfile?.id, type]);

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (rides.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        No {type} rides found.
      </Typography>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 0, bgcolor: "background.paper" }}>
      <List disablePadding>
        {rides.map((ride, index) => (
          <React.Fragment key={ride.rideId}>
            {index > 0 && <Divider />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                onSelectRide && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onSelectRide(ride)}
                  >
                    View
                  </Button>
                )
              }
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pr: 7,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{ maxWidth: "70%" }}
                    >
                      {ride.startLocation.address.substring(0, 20)}... →{" "}
                      {ride.endLocation.address.substring(0, 20)}...
                    </Typography>
                    <Chip
                      label={`${ride.availableSeats}/${ride.totalSeats} seats`}
                      size="small"
                      color={ride.availableSeats > 0 ? "success" : "error"}
                    />
                  </Box>
                }
                disableTypography
                secondary={
                  <Box component="div">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {formatDateTime(ride.startTime)} -{" "}
                      {formatDateTime(ride.endTime)}
                    </Typography>
                    <Box mt={0.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {ride.daysOfWeek?.join(", ") || "One-time ride"}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RidesList;
