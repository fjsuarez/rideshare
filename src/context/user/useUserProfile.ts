import { useCallback } from 'react';
import { userApi } from '../../services/api/endpoints/userApi';
import { UserProfile } from '../../services/models/userTypes';

export interface UserProfileOperations {
  fetchUserProfile: () => Promise<UserProfile>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  completeOnboarding: (isDriver: boolean, driverDetails?: any) => Promise<UserProfile>;
}

/**
 * Hook for user profile operations separate from authentication concerns
 */
export function useUserProfile(): UserProfileOperations {
  /**
   * Fetch the current user's profile
   */
  const fetchUserProfile = useCallback(async (): Promise<UserProfile> => {
    try {
      return await userApi.getUserProfile();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }, []);

  /**
   * Update the user profile with partial data
   */
  const updateUserProfile = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      return await userApi.updateProfile(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, []);

  /**
   * Complete the user onboarding process
   */
  const completeOnboarding = useCallback(async (
    isDriver: boolean, 
    driverDetails?: any
  ): Promise<UserProfile> => {
    try {
      return await userApi.completeOnboarding({ isDriver, driverDetails });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }, []);

  return {
    fetchUserProfile,
    updateUserProfile,
    completeOnboarding
  };
}