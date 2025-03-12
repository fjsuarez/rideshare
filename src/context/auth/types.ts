import { UserProfile } from "../../services/models/userTypes";

export interface AuthContextType {
  // State
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Operations
  loginUser: (email: string, password: string) => Promise<any>;
  registerUser: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => Promise<any>;
  logoutUser: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

export interface AuthStateType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}