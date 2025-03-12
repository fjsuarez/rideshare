import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { UserProfile } from '../../../services/models/userTypes';

interface ProfileHeaderProps {
  userProfile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile }) => {
  // Safely handle potentially undefined values
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');
  
  // Default to "Rider" if userType is undefined
  const userTypeLabel = userProfile?.userType === 'driver' ? 'Driver' : 'Rider';

  return (
    <>
      <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
        {initials}
      </Avatar>
      <Typography variant="h6">{fullName || 'User'}</Typography>
      <Typography variant="body2">{userProfile?.email || ''}</Typography>
      
      {userProfile?.phoneNumber && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {userProfile.phoneNumber}
        </Typography>
      )}
      
      <Typography 
        variant="body2" 
        sx={{ 
          bgcolor: 'accent.main', 
          color: 'white', 
          px: 2, 
          py: 0.5, 
          borderRadius: 1,
          mt: 2
        }}
      >
        {userTypeLabel}
      </Typography>
    </>
  );
};

export default ProfileHeader;