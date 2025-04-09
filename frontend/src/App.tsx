import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignupPage';
import Dashboard from './dashboard/Dashboard';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './dashboard/theme/customizations/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
