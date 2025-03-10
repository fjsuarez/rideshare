import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { userProfile } = useAuth();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  // Get user's display name
  const displayName = userProfile ? 
    `${userProfile.firstName} ${userProfile.lastName}` : 
    "User";

  return (
    <AppBar position="static">
      <Toolbar>
        <img
          src="/assets/logo.png"
          alt="RideShare Logo"
          style={{ width: 40, height: 40, marginRight: 8 }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Ride
          <Box component="span" sx={{ color: theme.palette.accent.main }}>
            Share
          </Box>
        </Typography>

        {isLoggedIn ? (
          <>
            <IconButton color="inherit" onClick={handleAvatarClick}>
              <Avatar alt={displayName}>
                {userProfile?.firstName?.[0] || "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem sx={{ pointerEvents: 'none' }}>
                {displayName}
              </MenuItem>
              <MenuItem sx={{ pointerEvents: 'none', fontSize: '0.8rem', color: 'gray' }}>
                {userProfile?.email}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

export default Header;