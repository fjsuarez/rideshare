import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ride, RideRequest } from '../../services/models/rideTypes';

interface RideContextType {
  selectedRide: Ride | null;
  selectRide: (ride: Ride | null) => void;
  selectedRequest: RideRequest | null;
  selectRequest: (request: RideRequest | null) => void;
  // Add more shared state as needed
}

const defaultContext: RideContextType = {
  selectedRide: null,
  selectRide: () => {},
  selectedRequest: null,
  selectRequest: () => {},
};

const RideContext = createContext<RideContextType>(defaultContext);

export const useRide = () => useContext(RideContext);

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);

  const selectRide = (ride: Ride | null) => {
    console.log("Selecting ride", ride);
    setSelectedRide(ride);
    // Clear selected request when selecting a ride
    if (ride) setSelectedRequest(null);
  };

  const selectRequest = (request: RideRequest | null) => {
    setSelectedRequest(request);
    // Clear selected ride when selecting a request
    if (request) setSelectedRide(null);
  };

  return (
    <RideContext.Provider
      value={{
        selectedRide,
        selectRide,
        selectedRequest,
        selectRequest,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};