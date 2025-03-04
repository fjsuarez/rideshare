import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: grey[50],
    },
    secondary: {
      main: grey[900],
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
