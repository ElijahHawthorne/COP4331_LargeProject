import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'light', //light mode theme
    primary: {
      main: '#37B6FF', // Curious Blue
    },
    secondary: {
      main: '#00112B', // Dark Green
    },
    background: {
      default: '#EFEFEF', // Suva Grey (light mode background)
      paper: '#FFFFFF',   // White for cards (light mode)
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
