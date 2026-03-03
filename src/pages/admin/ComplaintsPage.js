import React, { useEffect, useState } from 'react';
import api from '../../api';

function ComplaintsPage() {
  const [summary, setSummary] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    const res = await api.get('/admin/complaints/summary');
    setSummary(res.data);
  };

  const loadComplaints = async (priority) => {
    setLoading(true);
    const params =
      priority && priority !== 'All'
        ? {
            priority,
          }
        : {};
    const res = await api.get('/admin/complaints', { params });
    setComplaints(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSummary();
    loadComplaints('All');
  }, []);

  const handleFilterChange = (p) => {
    setPriorityFilter(p);
    loadComplaints(p);
  };

  const handleResolve = async (id) => {
    await api.patch(`/admin/complaints/${id}/resolve`);
    await loadComplaints(priorityFilter);
    await loadSummary();
  };

  return (
    <div>
      <h2>Complaints</h2>
      <p>Track all student complaints with urgency filters and resolution status.</p>

      {summary && (
        <>
          <h3>By Category</h3>
          <div className="grid grid-5">
            {summary.byCategory.map((c) => (
              <div className="card" key={c._id}>
                <div className="card-label">{c._id}</div>
                <div className="card-value">{c.count}</div>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: 24 }}>By Priority</h3>
          <div className="grid grid-3">
            {summary.byPriority.map((c) => (
              <div className="card" key={c._id}>
                <div className="card-label">{c._id}</div>
                <div className="card-value">{c.count}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 24, marginBottom: 8 }}>
        <strong>Filter by urgency: </strong>
        {['All', 'Urgent', 'Normal', 'Cool'].map((p) => (
          <button
            key={p}
            type="button"
            className={priorityFilter === p ? 'pill active' : 'pill'}
            onClick={() => handleFilterChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div>No complaints for this filter.</div>
      ) : (
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
                Room {c.roomNumber || '-'} | Block {c.block || '-'} /{' '}
                {c.subBlock || '-'}
                {c.student && (
                  <>
                    {' '}
                    | {c.student.name} ({c.student.rollNumber})
                  </>
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  disabled={c.status === 'Resolved'}
                  onClick={() => handleResolve(c._id)}
                >
                  {c.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintsPage;

