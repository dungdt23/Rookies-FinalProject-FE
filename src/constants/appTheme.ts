import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    lightGrey: Palette['primary'];
  }
  interface PaletteOptions {
    lightGrey: PaletteOptions['primary'];
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#d50000',
    },
    secondary: {
      main: '#f50057',
    },
    lightGrey: {
      main: '#eff1f5',
      light: '#eff1f5',
      dark: '#eff1f5',
      contrastText: '#eff1f5',
    }
  },
};

export const theme = createTheme(themeOptions);
