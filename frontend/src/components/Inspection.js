import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Inspection.css';

const Inspection = () => {
  const { vehicleId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    tires: {
      leftFront: '',
      rightFront: '',
      leftRear: '',
      rightRear: '',
    },
    battery: {
      make: '',
      voltage: '',
      waterLevel: '',
      damage: '',
      leak: '',
    },
    exterior: {
      rust: '',
      dent: '',
      damage: '',
      damageNotes: '',
    },
    brakes: {
      fluidLevel: '',
      frontCondition: '',
      rearCondition: '',
    },
    engine: {
      oilCondition: '',
      oilColour: '',
    },
    status: 'Pending',
  });

  useEffect(() => {
    fetchInspection();
  }, [vehicleId]);

  const fetchInspection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      // If inspection doesn't exist, that's okay - we'll create a new one
      console.log('No existing inspection');
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Inspection saved successfully!');
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save inspection');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h1>Vehicle Inspection Form</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        {/* Tires Section */}
        <h2>Tires</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Left Front</label>
            <input
              type="text"
              value={formData.tires.leftFront}
              onChange={(e) => handleChange('tires', 'leftFront', e.target.value)}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Right Front</label>
            <input
              type="text"
              value={formData.tires.rightFront}
              onChange={(e) => handleChange('tires', 'rightFront', e.target.value)}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Left Rear</label>
            <input
              type="text"
              value={formData.tires.leftRear}
              onChange={(e) => handleChange('tires', 'leftRear', e.target.value)}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Right Rear</label>
            <input
              type="text"
              value={formData.tires.rightRear}
              onChange={(e) => handleChange('tires', 'rightRear', e.target.value)}
              placeholder="Condition"
            />
          </div>
        </div>

        {/* Battery Section */}
        <h2>Battery</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Make</label>
            <input
              type="text"
              value={formData.battery.make}
              onChange={(e) => handleChange('battery', 'make', e.target.value)}
              placeholder="Battery make"
            />
          </div>
          <div className="form-group">
            <label>Voltage</label>
            <input
              type="text"
              value={formData.battery.voltage}
              onChange={(e) => handleChange('battery', 'voltage', e.target.value)}
              placeholder="Voltage"
            />
          </div>
          <div className="form-group">
            <label>Water Level</label>
            <input
              type="text"
              value={formData.battery.waterLevel}
              onChange={(e) => handleChange('battery', 'waterLevel', e.target.value)}
              placeholder="Water level"
            />
          </div>
        </div>

        {/* Brakes Section */}
        <h2>Brakes</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Fluid Level</label>
            <input
              type="text"
              value={formData.brakes.fluidLevel}
              onChange={(e) => handleChange('brakes', 'fluidLevel', e.target.value)}
              placeholder="Fluid level"
            />
          </div>
          <div className="form-group">
            <label>Front Condition</label>
            <input
              type="text"
              value={formData.brakes.frontCondition}
              onChange={(e) => handleChange('brakes', 'frontCondition', e.target.value)}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Rear Condition</label>
            <input
              type="text"
              value={formData.brakes.rearCondition}
              onChange={(e) => handleChange('brakes', 'rearCondition', e.target.value)}
              placeholder="Condition"
            />
          </div>
        </div>

        {/* Engine Section */}
        <h2>Engine</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Oil Condition</label>
            <input
              type="text"
              value={formData.engine.oilCondition}
              onChange={(e) => handleChange('engine', 'oilCondition', e.target.value)}
              placeholder="Oil condition"
            />
          </div>
          <div className="form-group">
            <label>Oil Colour</label>
            <input
              type="text"
              value={formData.engine.oilColour}
              onChange={(e) => handleChange('engine', 'oilColour', e.target.value)}
              placeholder="Oil colour"
            />
          </div>
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Saving...' : 'Save Inspection'}
        </button>
      </form>
    </div>
  );
};

export default Inspection;