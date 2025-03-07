import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface LoginPanelProps {
  onLogin: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials here
    if (isLoginMode) {
      // Handle login
      onLogin();
    } else {
      // Handle signup
      // Validate passwords match
      if (password === confirmPassword) {
        console.log('Sign up with:', { name, email, password });
        // In a real app, you would send this data to your backend
        // Then login the user after successful registration
        onLogin();
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsLoginMode(newValue === 0);
  };

  return (
    <Card sx={{ marginTop: { xs: 2, md: 0 }, maxWidth: 450, width: '100%' }}>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
      }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Welcome to Ride<Box component="span" sx={{ color: theme.palette.accent.main }}>
            Share
          </Box>
        </Typography>

        <Tabs
          value={isLoginMode ? 0 : 1}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {!isLoginMode && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLoginMode && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={password !== confirmPassword && confirmPassword !== ''}
              helperText={
                password !== confirmPassword && confirmPassword !== '' 
                  ? "Passwords don't match" 
                  : ""
              }
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, mb: 2,
              bgcolor: theme.palette.accent.main,
              '&:hover': {
                bgcolor: theme.palette.accent.dark,
              }
            }}
          >
            {isLoginMode ? "Sign In" : "Create Account"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginPanel;