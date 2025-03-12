import React from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface AuthTabsProps {
  isLoginMode: boolean;
  onTabChange: (isLogin: boolean) => void;
  accentColor: string;
  disabled: boolean;
}
const AuthTabs: React.FC<AuthTabsProps> = ({ 
  isLoginMode, 
  onTabChange, 
  accentColor, 
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue === 0);
  };

  return (
    <Tabs
      value={isLoginMode ? 0 : 1}
      onChange={handleChange}
      variant="fullWidth"
      sx={{
        mb: 3,
        "& .MuiTabs-indicator": {
          backgroundColor: accentColor,
          height: 3,
        },
        "& .Mui-selected": {
          color: `${accentColor} !important`,
          fontWeight: "bold",
        },
      }}
    >
      <Tab label="Sign In" />
      <Tab label="Sign Up" />
    </Tabs>
  );
}; export default AuthTabs;