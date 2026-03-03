import React, { useEffect, useState } from 'react';
import api from '../../api';

function FeesPage() {
  const [summary, setSummary] = useState(null);
  const [roll, setRoll] = useState('');
  const [student, setStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/fees/summary');
        setSummary(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setStudent(null);
    try {
      const res = await api.get(`/admin/fees/${roll}`);
      setStudent(res.data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Student not found');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount) return;
    try {
      const res = await api.post(`/admin/fees/${roll}/pay`, {
        amount: Number(amount),
        note: 'Manual update by admin',
      });
      setStudent(res.data);
      setAmount('');
      if (summary) {
        const updated = await api.get('/admin/fees/summary');
        setSummary(updated.data);
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to update payment');
    }
  };

  return (
    <div>
      <h2>Fees</h2>
      <p>Search students by roll number, view their fee status, and update transactions.</p>

      {summary && (
        <div className="grid grid-3">
          <div className="card">
            <div className="card-label">Cleared</div>
            <div className="card-value">{summary.cleared}</div>
          </div>
          <div className="card">
            <div className="card-label">Not Cleared</div>
            <div className="card-value">{summary.notCleared}</div>
          </div>
          <div className="card">
            <div className="card-label">Total Students</div>
            <div className="card-value">{summary.total}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="inline-form" style={{ marginTop: 16 }}>
        <label>
          Roll Number
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {error && <div style={{ marginTop: 8, color: 'red' }}>{error}</div>}

      {student && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>
            {student.name} ({student.rollNumber})
          </h3>
          <div>
            <strong>Branch / Year:</strong> {student.branch} / {student.year}
          </div>
          <div>
            <strong>Course:</strong> {student.course}
          </div>
          <div>
            <strong>Parent:</strong> {student.parentName} ({student.parentPhone})
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>Total Fee:</strong> ₹{student.feeTotal || 0} |{' '}
            <strong>Paid:</strong> ₹{student.feePaid || 0} |{' '}
            <strong>Due:</strong> ₹{(student.feeTotal || 0) - (student.feePaid || 0)}
          </div>
          <div>
            <strong>Due Date:</strong>{' '}
            {student.feeDueDate ? new Date(student.feeDueDate).toLocaleDateString() : 'N/A'}
          </div>

          <form onSubmit={handlePayment} className="inline-form" style={{ marginTop: 16 }}>
            <label>
              Amount Paid
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <button type="submit">Record Payment</button>
          </form>

          {student.transactions && student.transactions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <strong>Transaction History</strong>
              <ul>
                {student.transactions.map((t) => (
                  <li key={t._id}>
                    {new Date(t.date).toLocaleString()} - ₹{t.amount} ({t.note})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FeesPage;

