import React from "react";
import AuthContext from "./AuthContext";
import { useAuthState } from "./useAuthState";
import { useAuthOperations } from "./useAuthOperations";
import { Spinner } from "../../components/ui/Spinner";
import { AuthContextType } from "./types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { 
    userProfile, 
    isLoading, 
    isAuthenticated, 
    setUser, 
    refreshUserProfile 
  } = useAuthState();
  
  const { loginUser, registerUser, logoutUser } = useAuthOperations(setUser);

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};