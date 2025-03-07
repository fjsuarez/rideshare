import React from "react";
import Grid from "@mui/material/Grid2";

import LoginPanel from "./LoginPanel";
import AuthenticatedContent from "./AuthenticatedContent";

interface MainContentProps {
  isLoggedIn: boolean;
  isSmallScreen: boolean;
  onLogin: () => void;
}

function MainContent({ isLoggedIn, isSmallScreen, onLogin }: MainContentProps) {
  const containerStyles = {
    height: { xs: "calc(50% - 64px)", md: "calc(100% - 64px)" },
    padding: { xs: 0, md: 2 },
    paddingX: { lg: 10 },
    justifyContent: isLoggedIn ? "flex-start" : "center"
  };

  return (
    <Grid container spacing={{ xs: 0, md: 2 }} sx={containerStyles}>
      {isLoggedIn ? (
        <AuthenticatedContent isSmallScreen={isSmallScreen} />
      ) : (
        <LoginView onLogin={onLogin} />
      )}
    </Grid>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
      <LoginPanel onLogin={onLogin} />
    </Grid>
  );
}

export default MainContent;