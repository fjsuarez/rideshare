import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
        onLogin={() => {}}
      />
      <MainContent 
        isLoggedIn={isLoggedIn} 
        isSmallScreen={isSmallScreen} 
        onLogin={() => {}}
      />
    </Paper>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;