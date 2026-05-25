import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Inspection.css';

const Inspection = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    tires: {
      leftFront: '',
      rightFront: '',
      leftRear: '',
      rightRear: '',
    },
    battery: {
      make: '',
      replacementDate: '',
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
      suspensionOilLeak: '',
      images: [],
    },
    brakes: {
      fluidLevel: '',
      frontCondition: '',
      rearCondition: '',
      emergencyBrakeCondition: '',
      overallSummary: '',
    },
    engine: {
      rust: false,
      dent: false,
      damage: false,
      oilCondition: '',
      oilColour: '',
      brakeFluidCondition: '',
      brakeFluidColour: '',
      oilLeak: false,
    },
  });

  useEffect(() => {
    fetchInspection();
  }, [vehicleId]);

  const fetchInspection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.inspection) {
        setFormData(response.data.inspection);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inspection');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split('.');

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result]);
        setFormData((prev) => ({
          ...prev,
          exterior: {
            ...prev.exterior,
            images: [...prev.exterior.images, reader.result],
          },
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Inspection submitted successfully!');
      navigate('/inspector-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inspection');
    }
  };

  if (loading) return <div>Loading inspection form...</div>;

  return (
    <div className="inspection-container">
      <header className="inspection-header">
        <h1>Vehicle Inspection</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="inspection-form">
        {/* Tires Section */}
        <section className="inspection-section">
          <h2 className="section-title">Tires</h2>
          <div className="form-group">
            <label>Left Front:</label>
            <input
              type="text"
              name="tires.leftFront"
              value={formData.tires.leftFront}
              onChange={handleInputChange}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Right Front:</label>
            <input
              type="text"
              name="tires.rightFront"
              value={formData.tires.rightFront}
              onChange={handleInputChange}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Left Rear:</label>
            <input
              type="text"
              name="tires.leftRear"
              value={formData.tires.leftRear}
              onChange={handleInputChange}
              placeholder="Condition"
            />
          </div>
          <div className="form-group">
            <label>Right Rear:</label>
            <input
              type="text"
              name="tires.rightRear"
              value={formData.tires.rightRear}
              onChange={handleInputChange}
              placeholder="Condition"
            />
          </div>
        </section>

        {/* Battery Section */}
        <section className="inspection-section">
          <h2 className="section-title">Battery</h2>
          <div className="form-group">
            <label>Make:</label>
            <input
              type="text"
              name="battery.make"
              value={formData.battery.make}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Replacement Date:</label>
            <input
              type="date"
              name="battery.replacementDate"
              value={formData.battery.replacementDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Voltage:</label>
            <input
              type="text"
              name="battery.voltage"
              value={formData.battery.voltage}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Water Level:</label>
            <input
              type="text"
              name="battery.waterLevel"
              value={formData.battery.waterLevel}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Damage:</label>
            <input
              type="text"
              name="battery.damage"
              value={formData.battery.damage}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Leak:</label>
            <input
              type="text"
              name="battery.leak"
              value={formData.battery.leak}
              onChange={handleInputChange}
            />
          </div>
        </section>

        {/* Exterior Section */}
        <section className="inspection-section">
          <h2 className="section-title">Exterior</h2>
          <div className="form-group">
            <label>Rust:</label>
            <input
              type="text"
              name="exterior.rust"
              value={formData.exterior.rust}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Dent:</label>
            <input
              type="text"
              name="exterior.dent"
              value={formData.exterior.dent}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Damage:</label>
            <input
              type="text"
              name="exterior.damage"
              value={formData.exterior.damage}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Damage Notes:</label>
            <textarea
              name="exterior.damageNotes"
              value={formData.exterior.damageNotes}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Suspension Oil Leak:</label>
            <input
              type="text"
              name="exterior.suspensionOilLeak"
              value={formData.exterior.suspensionOilLeak}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Upload Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {uploadedImages.map((img, idx) => (
                <img key={idx} src={img} alt={`preview-${idx}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Brakes Section */}
        <section className="inspection-section">
          <h2 className="section-title">Brakes</h2>
          <div className="form-group">
            <label>Fluid Level:</label>
            <input
              type="text"
              name="brakes.fluidLevel"
              value={formData.brakes.fluidLevel}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Front Condition:</label>
            <input
              type="text"
              name="brakes.frontCondition"
              value={formData.brakes.frontCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Rear Condition:</label>
            <input
              type="text"
              name="brakes.rearCondition"
              value={formData.brakes.rearCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Emergency Brake Condition:</label>
            <input
              type="text"
              name="brakes.emergencyBrakeCondition"
              value={formData.brakes.emergencyBrakeCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Overall Summary:</label>
            <textarea
              name="brakes.overallSummary"
              value={formData.brakes.overallSummary}
              onChange={handleInputChange}
            />
          </div>
        </section>

        {/* Engine Section */}
        <section className="inspection-section">
          <h2 className="section-title">Engine</h2>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="engine.rust"
                checked={formData.engine.rust}
                onChange={handleInputChange}
              />
              Rust
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="engine.dent"
                checked={formData.engine.dent}
                onChange={handleInputChange}
              />
              Dent
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="engine.damage"
                checked={formData.engine.damage}
                onChange={handleInputChange}
              />
              Damage
            </label>
          </div>
          <div className="form-group">
            <label>Oil Condition:</label>
            <input
              type="text"
              name="engine.oilCondition"
              value={formData.engine.oilCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Oil Colour:</label>
            <input
              type="text"
              name="engine.oilColour"
              value={formData.engine.oilColour}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Brake Fluid Condition:</label>
            <input
              type="text"
              name="engine.brakeFluidCondition"
              value={formData.engine.brakeFluidCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Brake Fluid Colour:</label>
            <input
              type="text"
              name="engine.brakeFluidColour"
              value={formData.engine.brakeFluidColour}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="engine.oilLeak"
                checked={formData.engine.oilLeak}
                onChange={handleInputChange}
              />
              Oil Leak
            </label>
          </div>
        </section>

        <button type="submit" className="submit-btn">Submit Inspection</button>
      </form>
    </div>
  );
};

export default Inspection;
