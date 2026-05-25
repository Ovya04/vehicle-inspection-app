import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import InspectorDashboard from './components/InspectorDashboard';
import VehicleDetails from './components/VehicleDetails';
import Inspection from './components/Inspection';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/inspector-dashboard"
            element={
              <ProtectedRoute>
                <InspectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:customerId"
            element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspection/:vehicleId"
            element={
              <ProtectedRoute>
                <Inspection />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
