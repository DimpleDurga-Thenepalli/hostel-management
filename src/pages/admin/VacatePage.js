import React, { useState } from 'react';
import api from '../../api';

function VacatePage() {
  const [roll, setRoll] = useState('');
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setStudent(null);
    try {
      const res = await api.get(`/admin/students/${roll}`);
      setStudent(res.data);
    } catch (e) {
      console.error(e);
      setMessage(e.response?.data?.message || 'Student not found');
    }
  };

  const handleVacate = async () => {
    if (!window.confirm('Are you sure you want to vacate this student?')) return;
    try {
      await api.delete(`/admin/students/${roll}`);
      setMessage('Student vacated successfully, room and credentials cleared.');
      setStudent(null);
      setRoll('');
    } catch (e) {
      console.error(e);
      setMessage(e.response?.data?.message || 'Failed to vacate student');
    }
  };

  return (
    <div>
      <h2>Vacate Student</h2>
      <p>Remove a student from the hostel and free their room and login credentials.</p>

      <form onSubmit={handleSearch} className="inline-form">
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

      {message && <div style={{ marginTop: 8 }}>{message}</div>}

      {student && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>
            {student.name} ({student.rollNumber})
          </h3>
          <div>
            <strong>Room:</strong> {student.room?.roomNumber || 'N/A'} (
            {student.room?.block} / {student.room?.subBlock})
          </div>
          <div>
            <strong>Bed:</strong> {student.bedNumber}
          </div>
          <button
            type="button"
            style={{ marginTop: 12, backgroundColor: '#c0392b' }}
            onClick={handleVacate}
          >
            Vacate and Delete Student
          </button>
        </div>
      )}
    </div>
  );
}

export default VacatePage;

