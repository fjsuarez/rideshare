import axios from 'axios';

// Base API URL - this should match your API gateway configuration
const API_BASE_URL = '';

// Type definitions matching backend models
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

export const rideApi = {
  // Commute endpoints
  async createCommute(commute: Commute): Promise<Commute> {
    const response = await axios.post(`${API_BASE_URL}/rides/commutes`, commute);
    return response.data;
  },

  async getCommutes(): Promise<Commute[]> {
    const response = await axios.get(`${API_BASE_URL}/rides/commutes`);
    return response.data;
  },

  // Available rides
  async getAvailableRides(maxDistance: number = 5.0): Promise<Ride[]> {
    const response = await axios.get(`${API_BASE_URL}/rides/available`, {
      params: { max_distance: maxDistance }
    });
    return response.data;
  },

  // Ride endpoints
  async getAllRides(): Promise<Ride[]> {
    const response = await axios.get(`${API_BASE_URL}/rides`);
    return response.data;
  },

  async getRideById(rideId: string): Promise<Ride> {
    const response = await axios.get(`${API_BASE_URL}/rides/${rideId}`);
    return response.data;
  },

  async createRide(ride: Ride): Promise<Ride> {
    const response = await axios.post(`${API_BASE_URL}/rides`, ride);
    return response.data;
  },

  async deleteRide(rideId: string): Promise<any> {
    const response = await axios.delete(`${API_BASE_URL}/rides/${rideId}`);
    return response.data;
  },

  // Driver/Rider specific endpoints
  async getDriverRides(driverId: string): Promise<Ride[]> {
    const response = await axios.get(`${API_BASE_URL}/rides/driver/${driverId}`);
    return response.data;
  },

  async getRiderRides(riderId: string): Promise<Ride[]> {
    const response = await axios.get(`${API_BASE_URL}/rides/rider/${riderId}`);
    return response.data;
  },

  // Ride request endpoints
  async requestRide(request: RideRequest): Promise<RideRequest> {
    const response = await axios.post(`${API_BASE_URL}/rides/requests`, request);
    return response.data;
  },

  async approveRideRequest(requestId: string): Promise<any> {
    const response = await axios.put(`${API_BASE_URL}/rides/requests/${requestId}/approve`);
    return response.data;
  },

  async rejectRideRequest(requestId: string): Promise<any> {
    const response = await axios.put(`${API_BASE_URL}/rides/requests/${requestId}/reject`);
    return response.data;
  }
};

export default rideApi;