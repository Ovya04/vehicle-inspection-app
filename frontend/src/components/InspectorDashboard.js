import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const InspectorDashboard = () => {
  const { user, logout } = useAuth();

  // Existing customer list
  const [customers, setCustomers] = useState([]);

  // New pending inspection queue
  const [pendingInspections, setPendingInspections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Keep your original customer fetch
      const customersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/customers`,
        config
      );

      setCustomers(
        customersResponse.data.customers || []
      );

      // Additional pending inspection fetch
      const pendingResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/inspections/pending`,
        config
      );

      setPendingInspections(
        pendingResponse.data.inspections || []
      );

    } catch (err) {
      console.error('Dashboard fetch error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Original behaviour - do not change
  const handleCustomerClick = (customerId) => {
    navigate(`/vehicles/${customerId}`);
  };

  // New behaviour - inspector accepts a pending inspection
  const handleAcceptInspection = async (inspectionId) => {
    try {
      setError('');

      const token = localStorage.getItem('token');

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/inspections/${inspectionId}/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh dashboard so accepted job disappears
      // from the pending list
      await fetchDashboardData();

    } catch (err) {
      console.error(
        'Accept inspection error:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        'Unable to accept inspection'
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>
            Welcome, {user?.name || 'Inspector'}!
          </h1>

          <p>
            Vehicle management made easy
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* ORIGINAL CUSTOMER / VEHICLE SECTION               */}
      {/* ================================================= */}

      <div className="content">

        <h2>Customers</h2>

        {customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <div className="customers-grid">

            {customers.map((customer) => (
              <div
                key={customer._id}
                className="customer-card"
                onClick={() =>
                  handleCustomerClick(customer._id)
                }
              >
                <h3>{customer.name}</h3>

                <p>
                  <strong>Email:</strong>{' '}
                  {customer.email}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {customer.phone}
                </p>

                {customer.address && (
                  <p>
                    <strong>Address:</strong>{' '}
                    {customer.address}
                  </p>
                )}

                <button className="btn">
                  View Vehicles
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* NEW PENDING INSPECTION SECTION                    */}
      {/* ================================================= */}

      <div className="content">

        <h2>Pending Inspection Requests</h2>

        <p>
          Vehicles waiting to be accepted by an inspector.
        </p>

        {pendingInspections.length === 0 ? (
          <p>
            No vehicles are currently waiting for inspection.
          </p>
        ) : (
          <div className="customers-grid">

            {pendingInspections.map((inspection) => {
              const customer = inspection.customerId;
              const vehicle = inspection.vehicleId;

              return (
                <div
                  key={inspection._id}
                  className="customer-card"
                >

                  <h3>
                    {customer?.name || 'Customer'}
                  </h3>

                  {customer?.email && (
                    <p>
                      <strong>Email:</strong>{' '}
                      {customer.email}
                    </p>
                  )}

                  {customer?.phone && (
                    <p>
                      <strong>Phone:</strong>{' '}
                      {customer.phone}
                    </p>
                  )}

                  {customer?.companyName && (
                    <p>
                      <strong>Company:</strong>{' '}
                      {customer.companyName}
                    </p>
                  )}

                  <hr />

                  <h4>Vehicle Details</h4>

                  {vehicle ? (
                    <>
                      {vehicle.make && (
                        <p>
                          <strong>Make:</strong>{' '}
                          {vehicle.make}
                        </p>
                      )}

                      {vehicle.model && (
                        <p>
                          <strong>Model:</strong>{' '}
                          {vehicle.model}
                        </p>
                      )}

                      {vehicle.registrationNumber && (
                        <p>
                          <strong>
                            Registration:
                          </strong>{' '}
                          {vehicle.registrationNumber}
                        </p>
                      )}

                      {vehicle.year && (
                        <p>
                          <strong>Year:</strong>{' '}
                          {vehicle.year}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      Vehicle details unavailable.
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{' '}
                    {inspection.status}
                  </p>

                  <button
                    className="btn"
                    onClick={(e) => {
                      // Prevent parent-card click behaviour
                      e.stopPropagation();

                      handleAcceptInspection(
                        inspection._id
                      );
                    }}
                  >
                    Accept Inspection
                  </button>

                </div>
              );
            })}

          </div>
        )}
      </div>

    </div>
  );
};

export default InspectorDashboard;