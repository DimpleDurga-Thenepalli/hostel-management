import React, { useEffect, useState } from 'react';
import api from '../../api';

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [feeSummary, setFeeSummary] = useState(null);
  const [complaintsSummary, setComplaintsSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, feeRes, compRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/fees/summary'),
          api.get('/admin/complaints/summary'),
        ]);
        setData(dashRes.data);
        setFeeSummary(feeRes.data);
        setComplaintsSummary(compRes.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Overview of hostel status for Geetanjali Institute of Science and Technology.</p>
      <div className="grid grid-4">
        <StatCard label="Total Rooms" value={data.totalRooms} />
        <StatCard label="Total Students" value={data.totalStudents} />
        <StatCard label="Complaints" value={data.totalComplaints} />
        <StatCard label="Outing Requests" value={data.totalOutings} />
      </div>

      {feeSummary && (
        <>
          <h3 style={{ marginTop: 24 }}>Fee Status</h3>
          <div className="grid grid-3">
            <StatCard label="Cleared" value={feeSummary.cleared} />
            <StatCard label="Pending" value={feeSummary.notCleared} />
            <StatCard label="Total" value={feeSummary.total} />
          </div>
        </>
      )}

      {complaintsSummary && (
        <>
          <h3 style={{ marginTop: 24 }}>Complaints by Priority</h3>
          <div className="bar-chart">
            {['Urgent', 'Normal', 'Cool'].map((p) => {
              const found =
                complaintsSummary.byPriority.find((x) => x._id === p) || { count: 0 };
              return (
                <div key={p} className="bar-item">
                  <div
                    className="bar-fill"
                    style={{ height: 10 + found.count * 15 }}
                    title={`${p}: ${found.count}`}
                  />
                  <span>{p}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;

