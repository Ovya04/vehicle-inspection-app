import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const InspectorDashboard = () => {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(response.data.customers || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/vehicles/${customerId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || 'Inspector'}!</h1>
          <p>Vehicle management made easy</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h2>Customers</h2>
      
      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        <div className="customers-grid">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="customer-card"
              onClick={() => handleCustomerClick(customer._id)}
            >
              <h3>{customer.name}</h3>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              {customer.address && (
                <p>
                  <strong>Address:</strong> {customer.address}
                </p>
              )}
              <button className="btn">View Vehicles</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspectorDashboard;