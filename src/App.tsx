import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import ProfilePanel from "./components/ProfilePanel";
import ListPanel from "./components/ListPanel";
import MapPanel from "./components/MapPanel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListDrawer from "./components/ListDrawer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
    handleMenuClose();
  };

  const handleLogin = () => {
    // Implement your login logic here
    setIsLoggedIn(true);
  };

  return (
    <Paper sx={{ height: "100vh" }} elevation={3}>
      <AppBar position="static">
        <Toolbar>
          <img
            src="/assets/logo.png"
            alt="RideShare Logo"
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ride
            <Box component="span" sx={{ color: "#22A9E1" }}>
              Share
            </Box>
          </Typography>

          {isLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={handleAvatarClick}>
                <Avatar alt="User Avatar" src="/avatar.png" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Grid
        container
        spacing={{ xs: 0, md: 2 }}
        sx={{ height: { xs: "calc(50% - 64px)", md: "calc(100% - 64px)" }, padding: { xs: 0, md: 2}, paddingX: { lg: 10 } }}
      >
        <Grid
          size={{ xs: 12, md: 6, lg: 4 }}
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <ProfilePanel />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, lg: 4 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <ListPanel />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <MapPanel />
        </Grid>
        {isSmallScreen && <ListDrawer />}
      </Grid>
    </Paper>
  );
}

export default App;
