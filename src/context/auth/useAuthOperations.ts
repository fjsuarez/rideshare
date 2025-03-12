import { useCallback } from "react";
import { UserProfile } from "../../services/models/userTypes";
import { authApi } from "../../services/api/endpoints/authApi";
import * as tokenService from "../../services/tokenService";

interface AuthOperations {
  loginUser: (email: string, password: string) => Promise<any>;
  registerUser: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => Promise<any>;
  logoutUser: () => Promise<void>;
}

export function useAuthOperations(
  setUser: (user: UserProfile | null) => void
): AuthOperations {
  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response && response.token && response.user) {
        tokenService.setAuthToken(response.token);
        setUser(response.user);
      } else {
        console.error('Invalid response format:', response);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [setUser]);

  const registerUser = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => {
    try {
      const response = await authApi.signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });

      if (response && response.token && response.user) {
        tokenService.setAuthToken(response.token);
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }, [setUser]);

  const logoutUser = useCallback(async () => {
    try {
      await authApi.logout();
      tokenService.clearAuth();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      tokenService.clearAuth();
      setUser(null);
      throw error;
    }
  }, [setUser]);

  return {
    loginUser,
    registerUser,
    logoutUser
  };
}