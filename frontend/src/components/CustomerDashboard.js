import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';
import { translations, useTranslate } from '../i18n/translations';
import '../styles/Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const t = useTranslate(lang);
  
  const [vehicles, setVehicles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    color: '',
    mileage: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchVehicles();
    localStorage.setItem('lang', lang);
  }, [lang]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/customer-vehicles/my-vehicles`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataWithImage = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataWithImage.append(key, formData[key]);
      });
      
      if (image) {
        formDataWithImage.append('image', image);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/customer-vehicles/upload`,
        formDataWithImage,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess('Vehicle uploaded successfully!');
      setFormData({ make: '', model: '', year: new Date().getFullYear(), vin: '', color: '', mileage: '' });
      setImage(null);
      setShowUploadForm(false);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFC107',
      approved: '#4CAF50',
      rejected: '#F44336',
      inspecting: '#2196F3',
      completed: '#8BC34A',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t('welcome')}, {user.name || 'Customer'}!</h1>
          <p>{t('vehicleManagement')}</p>
        </div>
        <div className="header-actions">
          <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          <button onClick={handleLogout} className="logout-btn">{t('logout')}</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="content">
        <div className="section-header">
          <h2>{t('myVehicles')}</h2>
          <button onClick={() => setShowUploadForm(!showUploadForm)} className="btn">
            {showUploadForm ? t('cancel') : t('addVehicle')}
          </button>
        </div>

        {showUploadForm && (
          <form onSubmit={handleUploadVehicle} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>{t('name')}</label>
                <input type="text" name="make" value={formData.make} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>{t('vehicleModel')}</label>
                <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>{t('vehicleYear')}</label>
                <input type="number" name="year" value={formData.year} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('vin')}</label>
                <input type="text" name="vin" value={formData.vin} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>{t('color')}</label>
                <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>{t('mileage')}</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label>{t('uploadImage')}</label>
              <input type="file" onChange={handleImageChange} accept="image/*" />
            </div>

            <button type="submit" disabled={loading} className="btn">
              {loading ? t('loading') : t('submit')}
            </button>
          </form>
        )}

        {vehicles.length === 0 ? (
          <p>{t('failedToLoad')} {t('myVehicles').toLowerCase()}</p>
        ) : (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">
                {vehicle.imageUrl && (
                  <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-image" />
                )}
                <h3>{vehicle.make} {vehicle.model}</h3>
                <p><strong>{t('vehicleYear')}:</strong> {vehicle.year}</p>
                <p><strong>{t('vin')}:</strong> {vehicle.vin}</p>
                <p><strong>{t('mileage')}:</strong> {vehicle.mileage} km</p>
                <p>
                  <strong>{t('status')}:</strong> 
                  <span style={{ color: getStatusColor(vehicle.status), fontWeight: 'bold' }}>
                    {vehicle.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;