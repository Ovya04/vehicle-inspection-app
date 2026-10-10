import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || 'Customer'}!</h1>
          <p>Vehicle management portal</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="content">
        <h2>My Vehicles</h2>
        <p>Coming soon: Upload and manage your vehicles</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;