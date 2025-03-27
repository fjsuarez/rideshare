import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRide } from "../context/ride/RideContext";
import { Box, Typography, useTheme } from "@mui/material";
import polyline from "@mapbox/polyline";

const MapPanel: React.FC = () => {
  const { selectedRide, selectedRequest, userCommute, userRide } = useRide();
  const theme = useTheme();

  // Create custom styled icons using the app's theme colors
  const startIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.accent.main};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    [theme.palette.accent.main]
  );

  const endIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.primary.main};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    [theme.palette.primary.main]
  );
  // Add home location icon
  const homeIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.info.dark};
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 3px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    [theme.palette.info.dark]
  );

  // Add work location icon
  const workIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.warning.dark};
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 3px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    [theme.palette.warning.dark]
  );

  // Create icons for pickup and dropoff locations
  const pickupIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.success.light};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 3px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    [theme.palette.success.light]
  );

  const dropoffIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
      background-color: ${theme.palette.error.light};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 3px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    [theme.palette.error.light]
  );

  // Default position (Madrid, Spain)
  const defaultPosition: [number, number] = [40.4168, -3.7038];

  // Extract all rider pickup and dropoff locations
  const riderLocations = useMemo(() => {
    if (!selectedRide?.riders) return [];

    const locations: Array<{
      type: "pickup" | "dropoff";
      position: [number, number];
      address: string;
      riderId: string;
    }> = [];

    Object.entries(selectedRide.riders).forEach(([riderId, riderDetail]) => {
      if (riderDetail.pickupLocation) {
        locations.push({
          type: "pickup",
          position: [
            riderDetail.pickupLocation.latitude,
            riderDetail.pickupLocation.longitude,
          ] as [number, number],
          address: riderDetail.pickupLocation.address || "Unknown location",
          riderId,
        });
      }

      if (riderDetail.dropoffLocation) {
        locations.push({
          type: "dropoff",
          position: [
            riderDetail.dropoffLocation.latitude,
            riderDetail.dropoffLocation.longitude,
          ] as [number, number],
          address: riderDetail.dropoffLocation.address || "Unknown location",
          riderId,
        });
      }
    });

    return locations;
  }, [selectedRide?.riders]);

  // Determine which locations to show based on selection
  const startLocation = useMemo(() => {
    if (selectedRide) {
      return {
        position: [
          selectedRide.startLocation.latitude,
          selectedRide.startLocation.longitude,
        ] as [number, number],
        address: selectedRide.startLocation.address,
        time: new Date(selectedRide.startTime).toLocaleString(),
      };
    }
    if (selectedRequest) {
      return {
        position: [
          selectedRequest.pickupLocation?.latitude || 0,
          selectedRequest.pickupLocation?.longitude || 0,
        ] as [number, number],
        address: selectedRequest.pickupLocation?.address || "Unknown location",
        time: selectedRequest.createdAt
          ? new Date(selectedRequest.createdAt).toLocaleString()
          : "Time not specified",
      };
    }
    return null;
  }, [selectedRide, selectedRequest]);

  const endLocation = useMemo(() => {
    if (selectedRide) {
      return {
        position: [
          selectedRide.endLocation.latitude,
          selectedRide.endLocation.longitude,
        ] as [number, number],
        address: selectedRide.endLocation.address,
        time: new Date(selectedRide.endTime).toLocaleString(),
      };
    }
    if (selectedRequest) {
      return {
        position: [
          selectedRequest.dropoffLocation?.latitude || 0,
          selectedRequest.dropoffLocation?.longitude || 0,
        ] as [number, number],
        address: selectedRequest.dropoffLocation?.address || "Unknown location",
        time: "Arrival time not specified",
      };
    }
    return null;
  }, [selectedRide, selectedRequest]);

  // Calculate route points and create path
  const routePoints = useMemo(() => {
    if (selectedRequest && userCommute) {
      return []; // Return empty array to prevent line drawing
    }

    if (selectedRide?.ridePolyline) {
      return polyline.decode(selectedRide.ridePolyline);
    }

    // If viewing a request and user is a driver with a ride, use the driver's ride polyline
    if (selectedRequest && userRide?.ridePolyline) {
      return polyline.decode(userRide.ridePolyline);
    }

    const points: [number, number][] = [];

    if (startLocation) {
      points.push(startLocation.position);
    }

    // Add pickup locations
    const pickups = riderLocations
      .filter((loc) => loc.type === "pickup")
      .map((loc) => loc.position);
    points.push(...pickups);

    // Add dropoff locations
    const dropoffs = riderLocations
      .filter((loc) => loc.type === "dropoff")
      .map((loc) => loc.position);
    points.push(...dropoffs);

    if (endLocation) {
      points.push(endLocation.position);
    }

    return points;
  }, [startLocation, endLocation, riderLocations, selectedRide?.ridePolyline]);

  const commutePolylines = useMemo(() => {
    if (!userCommute?.ride_distances || !selectedRide) return null;

    // Find the matching ride distance entry
    const rideDistance = userCommute.ride_distances.find(
      (rd) => rd.ride_id === selectedRide.rideId
    );

    if (!rideDistance) return null;

    return {
      // Polyline from home to pickup
      entryRoute: rideDistance.entry_polyline
        ? polyline.decode(rideDistance.entry_polyline)
        : [],

      // Polyline from dropoff to work
      exitRoute: rideDistance.exit_polyline
        ? polyline.decode(rideDistance.exit_polyline)
        : [],
    };
  }, [userCommute, selectedRide]);

  const homeLocation = useMemo(() => {
    if (userCommute?.startLocation) {
      return {
        position: [
          userCommute.startLocation.latitude,
          userCommute.startLocation.longitude,
        ] as [number, number],
        address: userCommute.startLocation.address,
      };
    }
    return null;
  }, [userCommute]);

  // Extract work location from userCommute
  const workLocation = useMemo(() => {
    if (userCommute?.endLocation) {
      return {
        position: [
          userCommute.endLocation.latitude,
          userCommute.endLocation.longitude,
        ] as [number, number],
        address: userCommute.endLocation.address,
      };
    }
    return null;
  }, [userCommute]);

  // Calculate map bounds including all points
  const bounds = useMemo(() => {
    const allPoints: [number, number][] = [];

    if (startLocation) allPoints.push(startLocation.position);
    if (endLocation) allPoints.push(endLocation.position);

    // Add all rider locations
    riderLocations.forEach((loc) => {
      allPoints.push(loc.position);
    });

    // Add home and work locations if available
    if (homeLocation) allPoints.push(homeLocation.position);
    if (workLocation) allPoints.push(workLocation.position);

    if (allPoints.length > 0) {
      return L.latLngBounds(allPoints);
    }
    return undefined;
  }, [startLocation, endLocation, riderLocations, homeLocation, workLocation]);

  // MapViewAdjuster component
  const MapViewAdjuster = ({ bounds }: { bounds?: L.LatLngBounds }) => {
    const map = useMap();

    React.useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [bounds, map]);

    return null;
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {!startLocation && !endLocation && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            p: 2,
            borderRadius: 1,
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography>Select a ride to view on the map</Typography>
        </Box>
      )}

      <MapContainer
        center={startLocation?.position || defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // Hide default zoom control
      >
        {/* Use CartoDB Positron for a minimalistic map style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Add map adjustments */}
        <MapViewAdjuster bounds={bounds} />

        {/* Draw route line */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color={
              selectedRide?.ridePolyline ||
              (selectedRequest && userRide?.ridePolyline)
                ? theme.palette.primary.main
                : theme.palette.info.main
            }
            weight={
              selectedRide?.ridePolyline ||
              (selectedRequest && userRide?.ridePolyline)
                ? 4
                : 3
            }
            opacity={0.8}
            dashArray={
              selectedRide?.ridePolyline ||
              (selectedRequest && userRide?.ridePolyline)
                ? undefined
                : "5, 8"
            }
          />
        )}
        {/* Draw home to pickup walking route */}
        {commutePolylines &&
          commutePolylines.entryRoute &&
          commutePolylines.entryRoute.length > 1 && (
            <Polyline
              positions={commutePolylines.entryRoute as L.LatLngExpression[]}
              color={theme.palette.info.dark}
              weight={3}
              opacity={0.7}
              dashArray="5, 8"
            />
          )}

        {/* Draw dropoff to work walking route */}
        {commutePolylines &&
          commutePolylines.exitRoute &&
          commutePolylines.exitRoute.length > 1 && (
            <Polyline
              positions={commutePolylines.exitRoute as L.LatLngExpression[]}
              color={theme.palette.warning.dark}
              weight={3}
              opacity={0.7}
              dashArray="5, 8"
            />
          )}

        {/* Start location marker */}
        {startLocation && (
          <Marker position={startLocation.position} icon={startIcon}>
            <Popup className="custom-popup">
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="accent.main"
                >
                  {selectedRequest ? "Pickup Location" : "Start Location"}
                </Typography>
                <Typography variant="body2">{startLocation.address}</Typography>
                <Typography
                  variant="body2"
                  fontSize="0.8rem"
                  color="text.secondary"
                >
                  Departure: {startLocation.time}
                </Typography>
                {selectedRide && (
                  <Typography variant="body2" mt={1} fontSize="0.8rem">
                    {selectedRide.availableSeats}/{selectedRide.totalSeats}{" "}
                    seats available
                  </Typography>
                )}
              </Box>
            </Popup>
          </Marker>
        )}

        {/* Rider pickup locations */}
        {riderLocations
          .filter((loc) => loc.type === "pickup")
          .map((loc, index) => (
            <Marker
              key={`pickup-${loc.riderId}-${index}`}
              position={loc.position}
              icon={pickupIcon}
            >
              <Popup className="custom-popup">
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    Rider Pickup
                  </Typography>
                  <Typography variant="body2">{loc.address}</Typography>
                </Box>
              </Popup>
            </Marker>
          ))}

        {/* Rider dropoff locations */}
        {riderLocations
          .filter((loc) => loc.type === "dropoff")
          .map((loc, index) => (
            <Marker
              key={`dropoff-${loc.riderId}-${index}`}
              position={loc.position}
              icon={dropoffIcon}
            >
              <Popup className="custom-popup">
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="error.main"
                  >
                    Rider Dropoff
                  </Typography>
                  <Typography variant="body2">{loc.address}</Typography>
                </Box>
              </Popup>
            </Marker>
          ))}

        {/* End location marker */}
        {endLocation && (
          <Marker position={endLocation.position} icon={endIcon}>
            <Popup className="custom-popup">
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {selectedRequest ? "Dropoff Location" : "Destination"}
                </Typography>
                <Typography variant="body2">{endLocation.address}</Typography>
                <Typography
                  variant="body2"
                  fontSize="0.8rem"
                  color="text.secondary"
                >
                  Arrival: {endLocation.time}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        )}
        {/* Add home location marker */}
        {homeLocation && (
          <Marker position={homeLocation.position} icon={homeIcon}>
            <Popup className="custom-popup">
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="info.dark"
                >
                  Your Home
                </Typography>
                <Typography variant="body2">{homeLocation.address}</Typography>
              </Box>
            </Popup>
          </Marker>
        )}

        {/* Add work location marker */}
        {workLocation && (
          <Marker position={workLocation.position} icon={workIcon}>
            <Popup className="custom-popup">
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="warning.dark"
                >
                  Your Workplace
                </Typography>
                <Typography variant="body2">{workLocation.address}</Typography>
              </Box>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapPanel;
