import React, { useEffect, useState } from 'react';
import api from '../../api';

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/admin/notices');
      setNotices(res.data);
    } catch (e) {
      console.error(e);
      setError('Failed to load notices');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/admin/notices', { title, body });
      setTitle('');
      setBody('');
      await load();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to create notice');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/notices/${id}`);
    await load();
  };

  return (
    <div>
      <h2>Notices</h2>
      <p>Post and manage hostel notices visible to students and parents.</p>

      <form onSubmit={handleCreate} className="form-grid" style={{ marginBottom: 16 }}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
          />
        </label>
        <button type="submit">Post Notice</button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div className="list">
        {notices.map((n) => (
          <div className="card" key={n._id}>
            <div className="card-header">
              <span>
                <strong>{n.title}</strong>
              </span>
              <span>{new Date(n.postedAt).toLocaleDateString()}</span>
            </div>
            <div style={{ marginTop: 4 }}>{n.body}</div>
            <button
              type="button"
              style={{ marginTop: 8 }}
              onClick={() => handleDelete(n._id)}
            >
              Delete
            </button>
          </div>
        ))}
        {notices.length === 0 && <div>No notices yet.</div>}
      </div>
    </div>
  );
}

export default NoticesPage;

