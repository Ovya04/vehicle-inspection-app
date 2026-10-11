import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginSelection.css';

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-selection-container">
      <div className="login-selection-card">
        <h1>Vehicle Inspection System</h1>
        <p>Select your role to login</p>

        <div className="role-buttons">
          <button onClick={() => navigate('/login/inspector')} className="role-btn inspector-btn">
            <h2>🔍 Inspector</h2>
            <p>Inspect vehicles and update reports</p>
          </button>

          <button onClick={() => navigate('/login/customer')} className="role-btn customer-btn">
            <h2>🚗 Customer</h2>
            <p>Manage your owned vehicles</p>
          </button>

          <button onClick={() => navigate('/login/admin')} className="role-btn admin-btn">
            <h2>⚙️ Admin</h2>
            <p>Approve customers and manage system</p>
          </button>
        </div>

        <div className="registration-section">
          <p>Not a member?</p>
          <button onClick={() => navigate('/register/customer')} className="register-link">
            Register as Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
