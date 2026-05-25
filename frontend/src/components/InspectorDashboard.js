import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const InspectorDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(response.data.customers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CAT INSPECT</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="welcome-section">
        <h2>Welcome Inspector!</h2>
        <p>Vehicle management made easy</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading customers...</div>
      ) : (
        <div className="customers-grid">
          {customers.map((customer) => (
            <Link to={`/vehicles/${customer._id}`} key={customer._id}>
              <div className="customer-card">
                <div className="avatar">👤</div>
                <h3>{customer.name}</h3>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                <p className={`status ${customer.status.toLowerCase()}`}>
                  {customer.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <footer className="dashboard-footer">
        <p>© 2024 Vehicle Inspection System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InspectorDashboard;
