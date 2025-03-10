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
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

interface LoginPanelProps {
  onLogin: () => void; // Keep for backwards compatibility
}

const LoginPanel: React.FC<LoginPanelProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added phoneNumber
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  
  const { loginUser, registerUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLoginMode) {
        // Handle login with Firebase
        await loginUser(email, password);
      } else {
        // Handle signup with Firebase
        // Validate passwords match
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        
        await registerUser(email, password, name, phoneNumber);
      }
    } catch (error: any) {
      // Firebase auth errors have a code and message
      setError(error.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setIsLoginMode(newValue === 0);
    setError(null);
  };

  return (
    <Card sx={{ marginTop: { xs: 2, md: 0 }, maxWidth: 450, width: '100%', margin: '0 auto' }}>
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
          sx={{ 
            mb: 3,
            // Add these styles for better tab visualization
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.accent.main,
              height: 3
            },
            '& .Mui-selected': {
              color: `${theme.palette.accent.main} !important`,
              fontWeight: 'bold'
            }
          }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {!isLoginMode && (
            <>
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
              disabled={loading}
            />
            <TextField
            margin="normal"
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          </>
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
            disabled={loading}
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
            disabled={loading}
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
              disabled={loading}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 3, mb: 2,
              bgcolor: theme.palette.accent.main,
              '&:hover': {
                bgcolor: theme.palette.accent.dark,
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLoginMode ? "Sign In" : "Create Account"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginPanel;