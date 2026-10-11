import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginSelection from './pages/LoginSelection';
import InspectorLogin from './components/InspectorLogin';
import CustomerLogin from './components/CustomerLogin';
import AdminLogin from './components/AdminLogin';
import CustomerRegister from './components/CustomerRegister';
import Login from './components/Login';

import InspectorDashboard from './components/InspectorDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';

import VehicleDetails from './components/VehicleDetails';
import Inspection from './components/Inspection';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/App.css';

function App() {
  return (
    <Routes>

      {/* Login Selection */}
      <Route path="/" element={<LoginSelection />} />

      <Route
        path="/login/inspector"
        element={<InspectorLogin />}
      />

      <Route
        path="/login/customer"
        element={<CustomerLogin />}
      />

      <Route
        path="/login/admin"
        element={<AdminLogin />}
      />

      <Route
        path="/register/customer"
        element={<CustomerRegister />}
      />

      {/* Legacy Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Inspector Routes */}
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

      {/* Customer Routes */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;