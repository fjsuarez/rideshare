import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const EmptyProfile: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box textAlign="center" py={3}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No user profile data available
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Please log in to view your profile
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmptyProfile;