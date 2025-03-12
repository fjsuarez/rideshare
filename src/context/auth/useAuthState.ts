import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "../../services/models/userTypes";
import * as tokenService from "../../services/tokenService";
import { AuthStateType } from "./types";
import { userApi } from "../../services/api/endpoints/userApi";

export function useAuthState(): AuthStateType & {
  setUser: (user: UserProfile | null) => void;
  refreshUserProfile: () => Promise<UserProfile | null>;
  initializeAuth: () => Promise<void>;
} {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set user function - updates state and local storage
  const setUser = useCallback((user: UserProfile | null) => {
    setUserProfile(user);
    
    if (user) {
      tokenService.setUserData(user);
    }
  }, []);
  
  // Function to refresh the user profile from the API
  const refreshUserProfile = useCallback(async () => {
    // Check if we have a token before making the request
    if (!tokenService.getAuthToken()) {
      console.log("No auth token found, skipping profile refresh");
      return null;
    }
    
    try {
      const profile = await userApi.getUserProfile();
      if (profile) {
        setUserProfile(profile); // Use setUserProfile directly to avoid dependency loop
        tokenService.setUserData(profile);
      }
      return profile;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    }
  }, []); // Remove setUser from dependencies to avoid circular reference
  
  // Initialize auth state from stored data
  const initializeAuth = useCallback(async () => {
    try {
      const savedToken = tokenService.getAuthToken();
      const savedUserData = tokenService.getUserData();

      if (savedToken && savedUserData) {
        // First set the saved user data
        setUserProfile(savedUserData); // Use setUserProfile directly here
        
        try {
          // Then try to refresh with the latest data
          await refreshUserProfile();
        } catch (error) {
          console.error("Failed to refresh user profile:", error);
          tokenService.clearAuth();
          setUserProfile(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserProfile]); // Only depend on refreshUserProfile
  
  // Run initialization once on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return {
    userProfile,
    isLoading,
    isAuthenticated: !!userProfile,
    setUser,
    refreshUserProfile,
    initializeAuth
  };
}