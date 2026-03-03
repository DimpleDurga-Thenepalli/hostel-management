import React, { useEffect, useState } from 'react';
import api from '../../api';

function ParentFeesPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/parent/fees');
        setData(res.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load fee details');
      }
    };
    load();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading fee details...</div>;

  return (
    <div>
      <h2>Fee Details</h2>
      <div className="card">
        <div>
          <strong>Total Fee:</strong> ₹{data.feeTotal || 0}
        </div>
        <div>
          <strong>Paid:</strong> ₹{data.feePaid || 0}
        </div>
        <div>
          <strong>Due:</strong> ₹{data.due || 0}
        </div>
        <div>
          <strong>Due Date:</strong>{' '}
          {data.feeDueDate ? new Date(data.feeDueDate).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Transaction History</h3>
      {data.transactions && data.transactions.length > 0 ? (
        <ul>
          {data.transactions.map((t) => (
            <li key={t._id}>
              {new Date(t.date).toLocaleString()} - ₹{t.amount} ({t.note})
            </li>
          ))}
        </ul>
      ) : (
        <div>No transactions yet.</div>
      )}
    </div>
  );
}

export default ParentFeesPage;

