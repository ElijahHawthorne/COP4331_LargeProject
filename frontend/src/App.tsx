//import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/LoginPage';
//import CardPage from './Pages/CardPage';
import SignUpPage from './Pages/SignupPage';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<Dashboard />} />
=======
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
>>>>>>> f75ae77da371ed5ea1c031177f2d5d4145b9308c
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
