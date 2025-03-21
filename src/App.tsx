import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthProvider, useAuth } from "./context/auth";
import { RideProvider } from "./context/ride/RideContext";

import Header from "./components/Header";
import MainContent from "./components/MainContent";

function AppContent() {
  const { userProfile, logoutUser } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  const isLoggedIn = !!userProfile;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Paper sx={{ height: "100vh" }} elevation={3}>
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />
      <MainContent 
        isLoggedIn={isLoggedIn} 
        isSmallScreen={isSmallScreen} 
      />
    </Paper>
  );
}

function App() {
  return (
    <AuthProvider>
      <RideProvider>
        <AppContent />
      </RideProvider>
    </AuthProvider>
  );
}

export default App;