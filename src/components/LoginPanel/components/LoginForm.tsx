import React from 'react';
import TextField from "@mui/material/TextField";
import { AuthFormState } from '../types';

interface LoginFormProps {
  formState: AuthFormState;
  updateField: (field: keyof AuthFormState, value: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formState, updateField }) => {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formState.email}
        onChange={(e) => updateField('email', e.target.value)}
        disabled={formState.loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formState.password}
        onChange={(e) => updateField('password', e.target.value)}
        disabled={formState.loading}
      />
    </>
  );
}; export default LoginForm;