// theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import yellow from "@mui/material/colors/yellow";
import green from "@mui/material/colors/green";
import lightBlue from "@mui/material/colors/lightBlue";
import grey from "@mui/material/colors/grey";

//import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const theme1 = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5893df',
    },
    secondary: {
      main: '#2ec5d3',
    },
    background: {
      default: '#192231',
      paper: '#24344d',
    },
  },
});

export const orange1 = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: orange[500]
      },
      secondary: {
        light: red[500],
        main: red[700],
        dark: red[900],
        contrastText: grey[50]
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[300],
        contrastText: grey[800]
      },
      success: {
        main: green[500]
      },
      warning: {
        main: yellow[500],
        contrastText: grey[800]
      },
      info: {
        main: lightBlue[500]
      },
      text: {
        primary: grey[900],
        secondary: grey[700],
        disabled: grey[500]
      },
      action: {
        active: red[200],
        activeOpacity: 1,
        disabled: grey[700],
        disabledBackground: grey[200],
        hover: red[100],
        hoverOpacity: 0.7,
        focus: red[600],
        focusOpacity: 1,
        selected: red[300],
        selectedOpacity: 1
      },
      background: {
        default: orange[300],
        paper: grey[200]
      },
      common: {
        black: grey[900],
        white: grey[200]
      },
      tonalOffset: 0.2
    }
});

export const lightTheme = {
  body: '#E2E2E2',
  text: '#363537',
  toggleBorder: '#FFF',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
}

export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  gradient: 'linear-gradient(#091236, #1E215D)',
}
