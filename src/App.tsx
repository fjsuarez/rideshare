import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Header from "./components/Header";
import MainContent from "./components/MainContent";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Paper sx={{ height: "100vh" }} elevation={3}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin} />
      <MainContent isLoggedIn={isLoggedIn} isSmallScreen={isSmallScreen} onLogin={handleLogin} />
    </Paper>
  );
}

export default App;