import apiClient from '../core/apiClient';
import { UserProfile, OnboardingData} from '../../models/userTypes';


export const userApi = {
  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/', {
      method: 'POST',
      data: userData
    });
    return response.data;
  },

  async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/');
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
    const response = await apiClient.authenticatedRequest<UserProfile>('/users/', {
      method: 'PATCH',
      data: profileData
    });
    return response.data;
  }
};