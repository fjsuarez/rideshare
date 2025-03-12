import { createTheme } from '@mui/material/styles';
import { grey, red, lightBlue } from '@mui/material/colors';
import { light } from '@mui/material/styles/createPalette';

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
      main: lightBlue[500],

    },
    secondary: {
      main: grey[900],
    },
    error: {
      main: red.A400,
    },
    accent: {
        main: lightBlue[500],
        light: lightBlue[100],
        dark: lightBlue[900],
        contrastText: grey[50],
      },
  },
});

export default theme;
