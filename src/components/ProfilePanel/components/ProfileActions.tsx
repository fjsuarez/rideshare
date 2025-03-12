import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from "@mui/material/styles";

interface ProfileActionsProps {
  onEditProfile: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onEditProfile }) => {
  const theme = useTheme();
  return (
    <Box mt={3} textAlign="center" width="100%">
      <Button
        variant="contained"
        onClick={onEditProfile}
        sx={{
          mt: 3,
          mb: 2,
          bgcolor: `${theme.palette.accent.main}`,
          "&:hover": {
            bgcolor: `${theme.palette.accent.dark}`,
          },
          color: `${theme.palette.accent.contrastText}`,
        }}
      >
        Update Profile
      </Button>
    </Box>
  );
};

export default ProfileActions;