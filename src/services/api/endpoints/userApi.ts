import apiClient from '../core/apiClient';
import { UserProfile, DriverDetails } from '../../models/userTypes';

export interface OnboardingData {
  isDriver: boolean;
  userType?: 'rider' | 'driver';
  driverDetails?: DriverDetails;
}

export const userApi = {
  async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/profile');
    return response.data;
  },
  
  async completeOnboarding(data: OnboardingData): Promise<UserProfile> {
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/onboarding', {
      method: 'POST',
      data
    });
    return response.data;
  },
  
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/profile', {
      method: 'PATCH',
      data: profileData
    });
    return response.data;
  }
};