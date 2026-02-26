import React, { useEffect, useState } from 'react';
import api from '../../api';

function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    category: 'Water',
    priority: 'Normal',
    description: '',
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/student/complaints');
    setComplaints(res.data);
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
      await api.post('/student/complaints', form);
      setForm({ category: 'Water', priority: 'Normal', description: '' });
      setMessage('Complaint submitted successfully.');
      await load();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div>
      <h2>Complaints</h2>
      <p>View your complaint history and raise new complaints.</p>

      <h3>Raise New Complaint</h3>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Food">Food</option>
            <option value="Others">Others</option>
          </select>
        </label>
        <label>
          Priority
          <select
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
            <option value="Cool">Cool</option>
          </select>
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Complaint</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Your Complaints</h3>
      <div className="list">
        {complaints.map((c) => (
          <div className="card" key={c._id}>
            <div className="card-header">
              <span>
                <strong>{c.category}</strong> ({c.priority})
              </span>
              <span>Status: {c.status}</span>
            </div>
            <div style={{ marginTop: 4 }}>{c.description}</div>
            <div style={{ marginTop: 4, fontSize: 13, color: '#555' }}>
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {complaints.length === 0 && <div>No complaints yet.</div>}
      </div>
    </div>
  );
}

export default StudentComplaintsPage;

