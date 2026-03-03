import React, { useEffect, useState } from 'react';
import api from '../../api';

function StudentOutingsPage() {
  const [outings, setOutings] = useState([]);
  const [form, setForm] = useState({
    reason: '',
    fromDate: '',
    toDate: '',
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/student/outings');
    setOutings(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/student/outings', form);
      setForm({ reason: '', fromDate: '', toDate: '' });
      setMessage('Outing request submitted. Waiting for parent approval.');
      await load();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to submit outing request');
    }
  };

  return (
    <div>
      <h2>Outing Requests</h2>
      <p>View your outing request history and raise a new request.</p>

      <h3>Create New Request</h3>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Reason
          <textarea
            rows={2}
            value={form.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            required
          />
        </label>
        <label>
          From Date
          <input
            type="date"
            value={form.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            required
          />
        </label>
        <label>
          To Date
          <input
            type="date"
            value={form.toDate}
            onChange={(e) => handleChange('toDate', e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Request</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Your Requests</h3>
      <div className="card-grid">
        {outings.map((o) => (
          <div className="card" key={o._id}>
            <div>
              <strong>Reason:</strong> {o.reason}
            </div>
            <div>
              <strong>From:</strong> {new Date(o.fromDate).toLocaleDateString()} &nbsp;
              <strong>To:</strong> {new Date(o.toDate).toLocaleDateString()}
            </div>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              <strong>Parent:</strong> {o.parentApproved ? 'Approved' : 'Pending'} |{' '}
              <strong>HOD:</strong> {o.hodApproved ? 'Approved' : 'Pending'} |{' '}
              <strong>Admin:</strong> {o.adminApproved ? 'Approved' : 'Pending'}
            </div>
          </div>
        ))}
        {outings.length === 0 && <div>No outing requests yet.</div>}
      </div>
    </div>
  );
}

export default StudentOutingsPage;

