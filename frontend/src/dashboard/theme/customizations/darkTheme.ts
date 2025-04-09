import { createTheme } from "@mui/material/styles";

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#37B6FF',
    },
    secondary: {
      main: '#00112B',
    },
    background: {
      default: '#121212', //Dark background
      paper: '#1D1D1D',   //Slightly lighter for cards
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default themeDark;
