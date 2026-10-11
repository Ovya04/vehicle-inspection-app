import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';
import { useTranslate } from '../i18n/translations';
import '../styles/Inspection.css';

const Inspection = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const t = useTranslate(lang);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [damageImages, setDamageImages] = useState([]);
  const [summary, setSummary] = useState('');
  
  const [formData, setFormData] = useState({
    tires: { leftFront: '', rightFront: '', leftRear: '', rightRear: '' },
    battery: { make: '', voltage: '', waterLevel: '' },
    brakes: { fluidLevel: '', frontCondition: '', rearCondition: '' },
    engine: { oilCondition: '', oilColour: '' },
    status: 'Pending',
  });

  useEffect(() => {
    fetchInspection();
    localStorage.setItem('lang', lang);
  }, [vehicleId, lang]);

  const fetchInspection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      console.log('No existing inspection');
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload/single`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );

        setDamageImages(prev => [...prev, response.data.filePath]);
      }
      setSuccess('Images uploaded successfully!');
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const dataToSave = { ...formData, exterior: { ...formData.exterior, images: damageImages } };
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/inspections/vehicle/${vehicleId}`,
        dataToSave,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Inspection saved successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save inspection');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reports/inspection/${vehicleId}/pdf`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inspection_${vehicleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  const generateSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reports/inspection/${vehicleId}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t('inspectionForm')}</h1>
        </div>
        <div className="header-actions">
          <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          <button onClick={() => navigate(-1)} className="back-btn">← {t('back')}</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <h2>{t('tires')}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>{t('tires')} - Left Front</label>
            <input type="text" value={formData.tires.leftFront} onChange={(e) => handleChange('tires', 'leftFront', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('tires')} - Right Front</label>
            <input type="text" value={formData.tires.rightFront} onChange={(e) => handleChange('tires', 'rightFront', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('tires')} - Left Rear</label>
            <input type="text" value={formData.tires.leftRear} onChange={(e) => handleChange('tires', 'leftRear', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('tires')} - Right Rear</label>
            <input type="text" value={formData.tires.rightRear} onChange={(e) => handleChange('tires', 'rightRear', e.target.value)} />
          </div>
        </div>

        <h2>{t('battery')}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>{t('battery')} Make</label>
            <input type="text" value={formData.battery.make} onChange={(e) => handleChange('battery', 'make', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Voltage</label>
            <input type="text" value={formData.battery.voltage} onChange={(e) => handleChange('battery', 'voltage', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Water Level</label>
            <input type="text" value={formData.battery.waterLevel} onChange={(e) => handleChange('battery', 'waterLevel', e.target.value)} />
          </div>
        </div>

        <h2>{t('brakes')}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Fluid Level</label>
            <input type="text" value={formData.brakes.fluidLevel} onChange={(e) => handleChange('brakes', 'fluidLevel', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Front Condition</label>
            <input type="text" value={formData.brakes.frontCondition} onChange={(e) => handleChange('brakes', 'frontCondition', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rear Condition</label>
            <input type="text" value={formData.brakes.rearCondition} onChange={(e) => handleChange('brakes', 'rearCondition', e.target.value)} />
          </div>
        </div>

        <h2>{t('engine')}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Oil Condition</label>
            <input type="text" value={formData.engine.oilCondition} onChange={(e) => handleChange('engine', 'oilCondition', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Oil Color</label>
            <input type="text" value={formData.engine.oilColour} onChange={(e) => handleChange('engine', 'oilColour', e.target.value)} />
          </div>
        </div>

        <h2>{t('damageImages')}</h2>
        <div className="form-group">
          <label>{t('uploadImage')}</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {damageImages.length > 0 && (
            <div className="uploaded-images">
              <p>{damageImages.length} {t('uploadImage')} uploaded</p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? t('loading') : t('saveInspection')}
          </button>
          <button type="button" onClick={generateSummary} className="btn">
            {t('generateSummary')}
          </button>
          <button type="button" onClick={downloadPDF} className="btn">
            {t('downloadPDF')}
          </button>
        </div>
      </form>

      {summary && (
        <div className="summary-section">
          <h2>{t('inspectionSummary')}</h2>
          <pre>{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default Inspection;