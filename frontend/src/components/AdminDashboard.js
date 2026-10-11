import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [inspections, setInspections] = useState([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingInspections, setLoadingInspections] = useState(true);

  const [error, setError] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

 const fetchPendingCustomers = useCallback(async () => {
  try {
    setLoadingCustomers(true);
    setError('');

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/customers/pending`,
      getAuthConfig()
    );

    setPendingCustomers(response.data.customers || []);
  } catch (err) {
    console.error('Fetch pending customers error:', err);

    setError(
      err.response?.data?.message ||
      'Unable to load pending registrations'
    );
  } finally {
    setLoadingCustomers(false);
  }
}, []);

  


  useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoadingCustomers(true);
      setLoadingInspections(true);
      setError('');

      const [pendingResponse, inspectionsResponse] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/admin/customers/pending`,
          config
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/inspections`,
          config
        ),
      ]);

      setPendingCustomers(
        pendingResponse.data.customers || []
      );

      setInspections(
        inspectionsResponse.data.inspections || []
      );

    } catch (err) {
      console.error('Dashboard load error:', err);

      setError(
        err.response?.data?.message ||
        'Unable to load dashboard data'
      );
    } finally {
      setLoadingCustomers(false);
      setLoadingInspections(false);
    }
  };

  loadDashboardData();
}, []);

  const handleApprove = async (customerId) => {
    try {
      setError('');

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/admin/customers/${customerId}/approve`,
        {},
        getAuthConfig()
      );

      await fetchPendingCustomers();
    } catch (err) {
      console.error(
        'Approval error:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        'Unable to approve customer'
      );
    }
  };

  const handleReject = async (customerId) => {
    try {
      setError('');

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/admin/customers/${customerId}/reject`,
        {
          rejectionReason: 'Rejected by admin',
        },
        getAuthConfig()
      );

      await fetchPendingCustomers();
    } catch (err) {
      console.error(
        'Rejection error:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        'Unable to reject customer'
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>System management portal</p>
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

      {/* CUSTOMER APPROVAL SECTION */}

      <div className="content">
        <h2>Approval Center</h2>

        <p>
          Review and approve customer registrations.
        </p>

        {loadingCustomers ? (
          <p>Loading registrations...</p>
        ) : pendingCustomers.length === 0 ? (
          <p>No pending customer registrations.</p>
        ) : (
          <div className="customer-list">
            {pendingCustomers.map((customer) => (
              <div
                key={customer._id}
                className="customer-card"
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

                {customer.companyName && (
                  <p>
                    <strong>Company:</strong>{' '}
                    {customer.companyName}
                  </p>
                )}

                {customer.companyAddress && (
                  <p>
                    <strong>Address:</strong>{' '}
                    {customer.companyAddress}
                  </p>
                )}

                <p>
                  <strong>Status:</strong>{' '}
                  {customer.status}
                </p>

                <div className="approval-actions">
                  <button
                    onClick={() =>
                      handleApprove(customer._id)
                    }
                    className="approve-btn"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(customer._id)
                    }
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSPECTION MANAGEMENT SECTION */}

      <div className="content">
        <h2>Inspection Management</h2>

        <p>
          View pending, assigned, in-progress and completed inspections.
        </p>

        {loadingInspections ? (
          <p>Loading inspections...</p>
        ) : inspections.length === 0 ? (
          <p>No inspections found.</p>
        ) : (
          <div className="customer-list">
            {inspections.map((inspection) => {
              const customer = inspection.customerId;
              const vehicle = inspection.vehicleId;
              const inspector = inspection.inspectorId;

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
                      <strong>Customer Email:</strong>{' '}
                      {customer.email}
                    </p>
                  )}

                  {customer?.phone && (
                    <p>
                      <strong>Phone:</strong>{' '}
                      {customer.phone}
                    </p>
                  )}

                  {vehicle ? (
                    <>
                      <p>
                        <strong>Vehicle:</strong>{' '}
                        {vehicle.make || ''}{' '}
                        {vehicle.model || ''}
                      </p>

                      {vehicle.registrationNumber && (
                        <p>
                          <strong>
                            Registration:
                          </strong>{' '}
                          {vehicle.registrationNumber}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      <strong>Vehicle:</strong>{' '}
                      Not available
                    </p>
                  )}

                  <p>
                    <strong>Inspector:</strong>{' '}
                    {inspector?.name || 'Not assigned'}
                  </p>

                  {inspector?.email && (
                    <p>
                      <strong>
                        Inspector Email:
                      </strong>{' '}
                      {inspector.email}
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{' '}
                    {inspection.status}
                  </p>

                  {inspection.assignedAt && (
                    <p>
                      <strong>Assigned:</strong>{' '}
                      {new Date(
                        inspection.assignedAt
                      ).toLocaleString()}
                    </p>
                  )}

                  {inspection.startedAt && (
                    <p>
                      <strong>Started:</strong>{' '}
                      {new Date(
                        inspection.startedAt
                      ).toLocaleString()}
                    </p>
                  )}

                  {inspection.completedAt && (
                    <p>
                      <strong>Completed:</strong>{' '}
                      {new Date(
                        inspection.completedAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;