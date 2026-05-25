import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Register
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          formData
        );
        setError('');
        alert('Registration successful! Now login with your credentials.');
        setIsRegister(false);
        setFormData({ name: '', email: '', password: '' });
      } else {
        // Login
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/login`,
          { email: formData.email, password: formData.password }
        );

        login(response.data.inspector, response.data.token);
        navigate('/inspector-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CAT INSPECT</h1>
        <h2>{isRegister ? 'Inspector Registration' : 'Inspector Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        <div className="toggle-link">
          {isRegister ? (
            <>
              Already have an account? <button 
                type="button" 
                onClick={() => {
                  setIsRegister(false);
                  setFormData({ name: '', email: '', password: '' });
                  setError('');
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account? <button 
                type="button" 
                onClick={() => {
                  setIsRegister(true);
                  setFormData({ name: '', email: '', password: '' });
                  setError('');
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
