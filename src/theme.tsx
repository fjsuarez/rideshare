import { createTheme } from '@mui/material/styles';
import { grey, red, lightBlue } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface Palette {
      accent: Palette['primary'];
    }
    interface PaletteOptions {
      accent?: PaletteOptions['primary'];
    }
  }

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
    accent: {
        main: lightBlue[500],
        light: '#4DC3FF',
        dark: '#0088C3',
        contrastText: '#ffffff',
      },
  },
});

export default theme;
