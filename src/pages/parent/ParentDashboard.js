import React, { useEffect, useState } from 'react';
import api from '../../api';

function ParentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/parent/dashboard');
        setData(res.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load dashboard');
      }
    };
    load();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading dashboard...</div>;

  const { outingsCount, fee, notices } = data;

  return (
    <div>
      <h2>Parent Dashboard</h2>
      <p>Overview of your ward&apos;s hostel status.</p>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-label">Outing Requests</div>
          <div className="card-value">{outingsCount}</div>
        </div>
        <div className="card">
          <div className="card-label">Fee Due</div>
          <div className="card-value">₹{fee.due || 0}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Fee Summary</h3>
        <div>
          <strong>Total:</strong> ₹{fee.total || 0} | <strong>Paid:</strong> ₹
          {fee.paid || 0} | <strong>Due:</strong> ₹{fee.due || 0}
        </div>
        <div>
          <strong>Due Date:</strong>{' '}
          {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Latest Notices</h3>
      <div className="list">
        {notices.map((n) => (
          <div className="card" key={n._id}>
            <div className="card-header">
              <span>{n.title}</span>
              <span>{new Date(n.postedAt).toLocaleDateString()}</span>
            </div>
            <div style={{ marginTop: 4 }}>{n.body}</div>
          </div>
        ))}
        {notices.length === 0 && <div>No notices yet.</div>}
      </div>
    </div>
  );
}

export default ParentDashboard;

