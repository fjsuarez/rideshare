import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import * as apiClient from '../services/apiClient';
import * as tokenService from '../services/tokenService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: any | null; // Store user profile data from backend
  isLoading: boolean;
  registerUser: (email: string, password: string, name: string, phoneNumber: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isLoading: true,
  registerUser: async () => { throw new Error('AuthContext not initialized'); },
  loginUser: async () => { throw new Error('AuthContext not initialized'); },
  logoutUser: async () => { throw new Error('AuthContext not initialized'); },
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage on app load
  useEffect(() => {
    const savedUserData = tokenService.getUserData();
    const token = tokenService.getAuthToken();
    
    if (savedUserData && token) {
      setUserProfile(savedUserData);
    }
    
    setIsLoading(false);
  }, []);

  const registerUser = async (email: string, password: string, name: string, phoneNumber: string) => {
    try {
      // Parse name into firstName and lastName
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Use the API client to call the backend signup endpoint
      const response = await apiClient.signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });
      
      // Store token and user data
      if (response.token && response.user) {
        tokenService.setAuthToken(response.token);
        tokenService.setUserData(response.user);
        setUserProfile(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      // Use the API client to call the backend login endpoint
      const response = await apiClient.login(email, password);
      
      // Store token and user data
      if (response.token && response.user) {
        tokenService.setAuthToken(response.token);
        tokenService.setUserData(response.user);
        setUserProfile(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      // Clear local storage
      tokenService.clearAuth();
      
      // Reset state
      setUserProfile(null);
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};