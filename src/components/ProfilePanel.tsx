import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

const ProfilePanel: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">John Doe</Typography>
          <Typography variant="body2">john.doe@example.com</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePanel;