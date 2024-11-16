import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VehicleDetail from './pages/VehicleDetail';
import Notifications from './pages/Notifications';
import VideoPlayback from './pages/VideoPlayback';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Analytics from './pages/Analytics';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route
          path="/video"
          element={isAuthenticated() ? <VideoPlayback /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated() ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
