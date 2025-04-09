import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
//import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignupPage';
import Dashboard from './dashboard/Dashboard';
<<<<<<< HEAD
import { ThemeProvider, CssBaseline,} from '@mui/material';
import theme from './dashboard/theme/customizations/lightTheme';

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
=======
import AccountSettingsPage from './Pages/AccountSettingsPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accountsettings" element={<AccountSettingsPage/>} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
>>>>>>> origin/NewEliBranch
  );
}

export default App;
