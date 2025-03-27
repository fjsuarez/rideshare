import { useState } from "react";
import { useAuth } from "../../../context/auth";
import { AuthFormState } from "../types";

export const useAuthForm = () => {
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    phoneNumber: "",
    isLoginMode: true,
    error: null,
    loading: false,
  });

  const { loginUser, registerUser } = useAuth();

  const updateField = (field: keyof AuthFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = (isLoginMode: boolean) => {
    setFormState((prev) => ({ ...prev, isLoginMode, error: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateField("error", null);
    updateField("loading", true);

    try {
      if (formState.isLoginMode) {
        // Login flow handles token and user data from backend
        await loginUser(formState.email, formState.password);
      } else {
        if (formState.password !== formState.confirmPassword) {
          updateField("error", "Passwords don't match");
          updateField("loading", false);
          return;
        }

        // Signup flow creates user and handles onboarding status
        await registerUser(
          formState.email,
          formState.password,
          formState.firstName,
          formState.lastName,
          formState.phoneNumber
        );
      }
    } catch (error: any) {
      // Improved error handling with backend error messages
      const errorMessage =
        error.detail ||
        error.response?.data?.detail ||
        error.message ||
        "Authentication failed";
      updateField("error", errorMessage);
      console.error("Auth error:", error);
    } finally {
      updateField("loading", false);
    }
  };

  return {
    formState,
    updateField,
    toggleMode,
    handleSubmit,
  };
};
