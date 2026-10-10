import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/VehicleDetails.css';

const VehicleDetails = () => {
  const { customerId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [customerId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vehicles/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVehicles(response.data.vehicles || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleClick = (vehicleId) => {
    navigate(`/inspection/${vehicleId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <button onClick={() => navigate('/inspector-dashboard')} className="back-btn">
            ← Back
          </button>
          <h1>Customer Vehicles</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {vehicles.length === 0 ? (
        <p>No vehicles found for this customer</p>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="vehicle-card"
              onClick={() => handleVehicleClick(vehicle._id)}
            >
              <h3>
                {vehicle.make} {vehicle.model}
              </h3>
              <p>
                <strong>Year:</strong> {vehicle.year}
              </p>
              <p>
                <strong>VIN:</strong> {vehicle.vin}
              </p>
              <p>
                <strong>Color:</strong> {vehicle.color}
              </p>
              <p>
                <strong>Mileage:</strong> {vehicle.mileage} km
              </p>
              <button className="btn">Inspect Vehicle</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;