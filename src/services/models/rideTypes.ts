export interface Location {
    address?: string;
    latitude: number;
    longitude: number;
  }
  
  export interface RiderDetail {
    dropoffLocation?: Location;
    entryPolyline?: string;
    exitPolyline?: string;
    pickupLocation?: Location;
    requestId: string;
    rideStatus: 'pending' | 'approved' | 'rejected';
  }
  
  export interface Ride {
    availableSeats: number;
    createdAt: string;
    driverId: string;
    endLocation: Location;
    endTime: string;
    daysOfWeek?: string[];
    rideId: string;
    ridePolyline?: string;
    riders?: Record<string, RiderDetail>;
    startLocation: Location;
    startTime: string;
    status: 'active' | 'cancelled' | 'completed';
    totalSeats: number;
    updatedAt: string;
  }
  
  export interface RideRequest {
    createdAt: string;
    driverId: string;
    dropoffLocation?: Location;
    pickupLocation?: Location;
    requestId: string;
    rideId: string;
    riderId: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    updatedAt?: string
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
    ride_distances?: Array<RideDistance>;
  }

  export interface RideDistance {
    distance: number;
    entry_point: Location;
    entry_polyline: string;
    exit_point: Location;
    exit_polyline: string;
    ride_id: string;
  }