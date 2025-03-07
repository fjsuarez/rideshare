import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

function Header({ isLoggedIn, onLogin, onLogout }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

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
          <Button color="inherit" onClick={onLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;