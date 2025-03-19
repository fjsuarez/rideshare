import React from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton,
  Chip, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Commute } from '../../services/models/rideTypes';

interface CommuteInfoProps {
  commute: Commute;
  onEdit: () => void;
}

const CommuteInfo: React.FC<CommuteInfoProps> = ({ commute, onEdit }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Your Commute</Typography>
          <IconButton onClick={onEdit} size="small">
            <EditIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Home Location</Typography>
            <Typography>{commute.startLocation.address}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Work Location</Typography>
            <Typography>{commute.endLocation.address}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Schedule</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {commute.daysOfWeek.map(day => (
                <Chip key={day} label={day} size="small" />
              ))}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CommuteInfo;