import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignupPage';
import Dashboard from './dashboard/Dashboard';
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
  );
}

export default App;
