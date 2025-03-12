import { useState } from 'react';
import { useAuth } from '../../../context/auth';
import { userApi } from '../../../services/api/endpoints/userApi';
import { UserProfile } from '../../../services/models/userTypes';

export const useProfileData = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await userApi.updateProfile(data);
      await refreshUserProfile();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to format name
  const getFullName = () => {
    if (!userProfile) return '';
    return `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
  };

  // Helper to get user initials
  const getUserInitials = () => {
    if (!userProfile) return '';
    return (
      (userProfile.firstName?.[0] || '') + 
      (userProfile.lastName?.[0] || '')
    ).toUpperCase();
  };

  return {
    userProfile,
    isUpdating,
    error,
    updateUserProfile,
    refreshUserProfile,
    getFullName,
    getUserInitials
  };
};