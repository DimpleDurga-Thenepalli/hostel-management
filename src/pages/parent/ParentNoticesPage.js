import React, { useEffect, useState } from 'react';
import api from '../../api';

function ParentNoticesPage() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/parent/notices');
      setNotices(res.data);
    };
    load();
  }, []);

  return (
    <div>
      <h2>Notices</h2>
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

export default ParentNoticesPage;

