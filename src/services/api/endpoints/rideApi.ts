import apiClient from '../core/apiClient';
import { Commute, Ride, RideRequest } from '../../models/rideTypes';

export const rideApi = {
  // Commute endpoints
  async createCommute(commute: Commute): Promise<Commute> {
    const response = await apiClient.authenticatedRequest<Commute>('/rides/commutes/', {
      method: 'POST',
      data: commute
    });
    return response.data;
  },

  async getCommutes(): Promise<Commute[]> {
    const response = await apiClient.authenticatedRequest<Commute[]>('/rides/commutes/');
    return response.data;
  },

  async updateCommute(commute: Commute): Promise<Commute> {
    const response = await apiClient.authenticatedRequest<Commute>(`/rides/commutes/${commute.commuteId}`, {
      method: 'PUT',
      data: commute
    });
    return response.data;
  },

  // Available rides
  async getAvailableRides(maxDistance: number = 5.0): Promise<Ride[]> {
    const response = await apiClient.authenticatedRequest<Ride[]>('/rides/available/', {
      method: 'GET',
      params: { max_distance: maxDistance }
    });
    return response.data;
  },

  // Ride endpoints
  async getAllRides(): Promise<Ride[]> {
    const response = await apiClient.authenticatedRequest<Ride[]>('/rides');
    return response.data;
  },

  async getRideById(rideId: string): Promise<Ride> {
    const response = await apiClient.authenticatedRequest<Ride>(`/rides/${rideId}`);
    return response.data;
  },

  async createRide(ride: Ride): Promise<Ride> {
    const response = await apiClient.authenticatedRequest<Ride>('/rides/', {
      method: 'POST',
      data: ride
    });
    return response.data;
  },

  async updateRide(ride: Ride): Promise<Ride> {
    const response = await apiClient.authenticatedRequest<Ride>(`/rides/${ride.rideId}`, {
      method: 'PUT',
      data: ride
    });
    return response.data;
  },

  async deleteRide(rideId: string): Promise<any> {
    const response = await apiClient.authenticatedRequest<any>(`/rides/${rideId}`, {
      method: 'DELETE'
    });
    return response.data;
  },

  // Driver/Rider specific endpoints
  async getDriverRides(driverId: string): Promise<Ride[]> {
    const response = await apiClient.authenticatedRequest<Ride[]>(`/rides/driver/${driverId}`);
    return response.data;
  },

  async getRiderRides(riderId: string): Promise<Ride[]> {
    const response = await apiClient.authenticatedRequest<Ride[]>(`/rides/rider/${riderId}`);
    return response.data;
  },

  // Ride request endpoints
  async requestRide(request: RideRequest): Promise<RideRequest> {
    const response = await apiClient.authenticatedRequest<RideRequest>('/rides/requests', {
      method: 'POST',
      data: request
    });
    return response.data;
  },

  async getRiderRequests(riderId: string): Promise<RideRequest[]> {
    const response = await apiClient.authenticatedRequest<RideRequest[]>(`/rides/requests/rider/${riderId}`);
    return response.data;
  },

  async getDriverRequests(driverId: string): Promise<RideRequest[]> {
    const response = await apiClient.authenticatedRequest<RideRequest[]>(`/rides/requests/driver/${driverId}`);
    return response.data;
  },

  async approveRideRequest(requestId: string): Promise<any> {
    const response = await apiClient.authenticatedRequest<any>(`/rides/requests/${requestId}/approve`, {
      method: 'PUT'
    });
    return response.data;
  },

  async rejectRideRequest(requestId: string): Promise<any> {
    const response = await apiClient.authenticatedRequest<any>(`/rides/requests/${requestId}/reject`, {
      method: 'PUT'
    });
    return response.data;
  }
};

export default rideApi;