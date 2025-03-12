import React from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AuthFormState } from '../types';

interface RegistrationFormProps {
  formState: AuthFormState;
  updateField: (field: keyof AuthFormState, value: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ formState, updateField }) => {
  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          value={formState.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          disabled={formState.loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          value={formState.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          disabled={formState.loading}
        />
      </Box>
      <TextField
        margin="normal"
        fullWidth
        id="phoneNumber"
        label="Phone Number"
        name="phoneNumber"
        autoComplete="tel"
        value={formState.phoneNumber}
        onChange={(e) => updateField('phoneNumber', e.target.value)}
        disabled={formState.loading}
      />
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
        autoComplete="new-password"
        value={formState.password}
        onChange={(e) => updateField('password', e.target.value)}
        disabled={formState.loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formState.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={formState.password !== formState.confirmPassword && formState.confirmPassword !== ""}
        helperText={
          formState.password !== formState.confirmPassword && formState.confirmPassword !== ""
            ? "Passwords don't match"
            : ""
        }
        disabled={formState.loading}
      />
    </>
  );
}; export default RegistrationForm;