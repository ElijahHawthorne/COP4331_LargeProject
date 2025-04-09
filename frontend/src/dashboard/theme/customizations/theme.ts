import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#37B6FF', //Curious Blue
    },
    secondary: {
      main: '#00112B', //Dark Green
    },
    background: {
      default: '#EFEFEF', // Suva Grey, main background
      paper: '#FFFFFF',   // White, for cards
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
