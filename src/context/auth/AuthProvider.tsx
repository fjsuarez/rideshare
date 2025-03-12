import React from "react";
import AuthContext from "./AuthContext";
import { useAuthState } from "./useAuthState";
import { useAuthOperations } from "./useAuthOperations";
import { Spinner } from "../../components/ui/Spinner";
import { AuthContextType } from "./types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get auth state and methods to update it
  const { 
    userProfile, 
    isLoading, 
    isAuthenticated, 
    setUser, 
    refreshUserProfile 
  } = useAuthState();
  
  // Get auth operations that depend on the state
  const { loginUser, registerUser, logoutUser } = useAuthOperations(setUser);

  // Combine everything to create the context value
  const value: AuthContextType = {
    userProfile,
    isLoading,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    refreshUserProfile,
  };

  // Show loading spinner while initializing
  if (isLoading) {
    return <Spinner />;
  }

  // Provide auth context to children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};