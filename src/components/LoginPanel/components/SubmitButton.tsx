import React from 'react';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

interface SubmitButtonProps {
  isLoginMode: boolean;
  loading: boolean;
  accentColor: string;
  accentDarkColor: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoginMode, 
  loading, 
  accentColor, 
  accentDarkColor 
}) => {
  const theme = useTheme();

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={loading}
      sx={{
        mt: 3,
        mb: 2,
        bgcolor: accentColor,
        "&:hover": {
          bgcolor: accentDarkColor,
        },
        color: `${theme.palette.accent.contrastText}`,
      }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : isLoginMode ? (
        "Sign In"
      ) : (
        "Create Account"
      )}
    </Button>
  );
}; export default SubmitButton;;