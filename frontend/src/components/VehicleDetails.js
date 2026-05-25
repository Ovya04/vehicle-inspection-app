import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/VehicleDetails.css';

const VehicleDetails = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { customerId } = useParams();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchVehicles();
  }, [customerId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vehicles/customer/${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(response.data.vehicles);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-details-container">
      <header className="vehicle-header">
        <h1>CAT INSPECT</h1>
        <Link to="/inspector-dashboard" className="back-btn">Back to Dashboard</Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="no-vehicles">No vehicles found for this customer</div>
      ) : (
        <div className="vehicles-list">
          {vehicles.map((vehicle) => (
            <div className="vehicle-card" key={vehicle._id}>
              {vehicle.imageUrl && (
                <img src={vehicle.imageUrl} alt={vehicle.vehicleName} className="vehicle-image" />
              )}
              <h3>{vehicle.vehicleName}</h3>
              <p>Type: {vehicle.vehicleType}</p>
              <Link to={`/inspection/${vehicle._id}`} className="service-btn">
                Service Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <footer className="vehicle-footer">
        <p>© 2024 Vehicle Inspection System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VehicleDetails;
