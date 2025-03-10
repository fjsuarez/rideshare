import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthContext';

const ProfilePanel: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <Card>
        <CardContent>
          <Typography>No user profile data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
  const initials = userProfile.firstName?.[0] || '' + userProfile.lastName?.[0] || '';

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
            {initials}
          </Avatar>
          <Typography variant="h6">{fullName}</Typography>
          <Typography variant="body2">{userProfile.email}</Typography>
          {userProfile.phoneNumber && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {userProfile.phoneNumber}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePanel;