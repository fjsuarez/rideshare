import { createContext, useContext } from "react";
import { AuthContextType } from "./types";
import { UserProfile } from "../../services/models/userTypes";

// Create the context with sensible defaults
const AuthContext = createContext<AuthContextType>({
  // State
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  
  // Operations
  loginUser: async () => {
    throw new Error("AuthContext not initialized");
  },
  registerUser: async () => {
    throw new Error("AuthContext not initialized");
  },
  logoutUser: async () => {
    throw new Error("AuthContext not initialized");
  },
  refreshUserProfile: async (): Promise<UserProfile | null> => {
    throw new Error("AuthContext not initialized");
  },
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;