export interface AuthFormState {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    phoneNumber: string;
    isLoginMode: boolean;
    error: string | null;
    loading: boolean;
  }
