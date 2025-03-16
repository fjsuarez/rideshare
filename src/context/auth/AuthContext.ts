import { createContext, useContext } from "react";
import { AuthContextType } from "./types";
import { UserProfile } from "../../services/models/userTypes";

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  
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

export const useAuth = () => useContext(AuthContext);
export default AuthContext;