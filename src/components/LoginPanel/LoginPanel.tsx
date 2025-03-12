import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import SubmitButton from './components/SubmitButton';
import { useAuthForm } from './hooks/useAuthForm';

const LoginPanel: React.FC = () => {
  const theme = useTheme();
  const { formState, updateField, toggleMode, handleSubmit } = useAuthForm();

  return (
    <Card
      sx={{
        marginTop: { xs: 2, md: 0 },
        maxWidth: 450,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Welcome to Ride
          <Box component="span" sx={{ color: theme.palette.accent.main }}>
            Share
          </Box>
        </Typography>

        <AuthTabs 
          isLoginMode={formState.isLoginMode}
          onTabChange={toggleMode}
          accentColor={theme.palette.accent.main}
          disabled={formState.loading}
        />

        {formState.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formState.error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {formState.isLoginMode ? (
            <LoginForm formState={formState} updateField={updateField} />
          ) : (
            <RegistrationForm formState={formState} updateField={updateField} />
          )}
          
          <SubmitButton 
            isLoginMode={formState.isLoginMode}
            loading={formState.loading}
            accentColor={theme.palette.accent.main}
            accentDarkColor={theme.palette.accent.dark}
          />
        </Box>
      </CardContent>
    </Card>
  );
}; export default LoginPanel;