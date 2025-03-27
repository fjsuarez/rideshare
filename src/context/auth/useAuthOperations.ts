import { useCallback } from "react";
import { UserProfile } from "../../services/models/userTypes";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  setAuthToken,
  setUserData,
  clearAuth,
} from "../../services/tokenService";
import { userApi } from "../../services/api/endpoints/userApi";

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
  const loginUser = useCallback(
    async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        setAuthToken(await user.getIdToken());
        setUserData(user);
        const userProfile = await userApi.getUserProfile();
        setUser(userProfile);
        return { success: true };
      } catch (error: any) {
        if (error.code === "auth/invalid-credential") {
          throw new Error("Invalid email or password");
        } else if (error.code === "auth/user-not-found") {
          throw new Error("User not found");
        } else if (error.code === "auth/wrong-password") {
          throw new Error("Wrong password");
        } else if (error.code === "auth/too-many-requests") {
          throw new Error(
            "Too many failed login attempts. Please try again later."
          );
        } else {
          throw new Error("An error occurred during login. Please try again.");
        }
      }
    },
    [setUser]
  );

  const registerUser = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      phoneNumber: string
    ) => {
      let firebaseUser = null;

      try {
        // Basic client-side validation first
        if (!phoneNumber || phoneNumber.length < 9) {
          throw new Error(
            "Phone number is too short (minimum 9 digits required)"
          );
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        firebaseUser = userCredential.user;

        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
        setUserData(firebaseUser);

        try {
          const userData: Partial<UserProfile> = {
            email: email,
            firstName,
            lastName,
            phoneNumber,
          };
          const userProfile = await userApi.createUser(userData);
          setUser(userProfile);
          return { success: true };
        } catch (backendError: any) {
          if (firebaseUser) {
            await firebaseUser.delete();
            clearAuth();
          }
          throw backendError;
        }
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          throw new Error("Email is already registered");
        } else if (error.code === "auth/invalid-email") {
          throw new Error("Invalid email format");
        } else if (error.code === "auth/weak-password") {
          throw new Error("Password is too weak");
        } else if (error.detail) {
          throw error;
        } else {
          throw new Error(
            error.message || "Registration failed. Please try again."
          );
        }
      }
    },
    [setUser]
  );

  const logoutUser = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearAuth();
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  }, [setUser]);

  return {
    loginUser,
    registerUser,
    logoutUser,
  };
}
