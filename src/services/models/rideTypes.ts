export interface Location {
    latitude: number;
    longitude: number;
    address: string;
  }
  
  export interface RiderDetail {
    requestId: string;
    rideStatus: 'pending' | 'approved' | 'rejected';
    pickupLocation?: Location;
    dropoffLocation?: Location;
  }
  
  export interface Ride {
    rideId: string;
    driverId: string;
    startLocation: Location;
    endLocation: Location;
    startTime: string;
    endTime: string;
    daysOfWeek?: string[];
    availableSeats: number;
    totalSeats: number;
    status: 'active' | 'cancelled' | 'completed';
    riders?: Record<string, RiderDetail>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface RideRequest {
    requestId: string;
    driverId: string;
    rideId: string;
    riderId: string;
    status: 'pending' | 'approved' | 'rejected';
    pickupLocation?: Location;
    dropoffLocation?: Location;
    createdAt: string;
  }
  
  export interface Commute {
    commuteId: string;
    userId: string;
    startLocation: Location;
    endLocation: Location;
    preferredStartTime: string;
    preferredEndTime: string;
    daysOfWeek: string[];
    createdAt: string;
    updatedAt: string;
  }