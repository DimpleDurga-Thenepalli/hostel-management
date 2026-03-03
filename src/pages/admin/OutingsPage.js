import React, { useEffect, useState } from 'react';
import api from '../../api';

function OutingsPage() {
  const [outings, setOutings] = useState([]);

  const load = async () => {
    const res = await api.get('/admin/outings/pending');
    setOutings(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, type) => {
    if (type === 'admin') {
      await api.patch(`/admin/outings/${id}/admin-approve`);
    } else {
      await api.patch(`/admin/outings/${id}/hod-approve`);
    }
    await load();
  };

  return (
    <div>
      <h2>Outing Requests</h2>
      <p>
        Review outing requests that have been approved by parents and update HOD / Admin
        approvals.
      </p>

      {outings.length === 0 ? (
        <div>No pending outing requests yet.</div>
      ) : (
        <div className="card-grid">
          {outings.map((o) => (
            <div className="card" key={o._id}>
              <h3>
                {o.student?.name} ({o.student?.rollNumber})
              </h3>
              <div>
                <strong>Reason:</strong> {o.reason}
              </div>
              <div>
                <strong>From:</strong> {new Date(o.fromDate).toLocaleDateString()} &nbsp;
                <strong>To:</strong> {new Date(o.toDate).toLocaleDateString()}
              </div>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                <strong>Parent Approval:</strong> {o.parentApproved ? 'Approved' : 'Pending'}
                {' | '}
                <strong>HOD:</strong> {o.hodApproved ? 'Approved' : 'Pending'}
                {' | '}
                <strong>Admin:</strong> {o.adminApproved ? 'Approved' : 'Pending'}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  disabled={o.hodApproved}
                  onClick={() => updateStatus(o._id, 'hod')}
                >
                  {o.hodApproved ? 'HOD Approved' : 'Approve as HOD'}
                </button>
                <button
                  type="button"
                  disabled={o.adminApproved}
                  onClick={() => updateStatus(o._id, 'admin')}
                >
                  {o.adminApproved ? 'Admin Approved' : 'Approve as Admin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OutingsPage;

