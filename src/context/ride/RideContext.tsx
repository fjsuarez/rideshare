import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ride, RideRequest, Commute } from '../../services/models/rideTypes';

interface RideContextType {
  selectedRide: Ride | null;
  selectRide: (ride: Ride | null) => void;
  selectedRequest: RideRequest | null;
  selectRequest: (request: RideRequest | null) => void;
  userCommute: Commute | null;
  setUserCommute: (commute: Commute | null) => void;
  userRide: Ride | null;
  setUserRide: (ride: Ride | null) => void;
}

const defaultContext: RideContextType = {
  selectedRide: null,
  selectRide: () => {},
  selectedRequest: null,
  selectRequest: () => {},
  userCommute: null,
  setUserCommute: () => {},
  userRide: null,
  setUserRide: () => {},
};

const RideContext = createContext<RideContextType>(defaultContext);

export const useRide = () => useContext(RideContext);

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [userCommute, setUserCommute] = useState<Commute | null>(null);
  const [userRide, setUserRide] = useState<Ride | null>(null);

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
        userCommute,
        setUserCommute,
        userRide,
        setUserRide
      }}
    >
      {children}
    </RideContext.Provider>
  );
};