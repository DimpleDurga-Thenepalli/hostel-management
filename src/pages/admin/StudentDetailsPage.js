import React, { useEffect, useState } from 'react';
import api from '../../api';

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [rollFilter, setRollFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (roll) => {
    setLoading(true);
    const params = roll ? { roll } : {};
    const res = await api.get('/admin/students', { params });
    setStudents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(rollFilter);
  };

  return (
    <div>
      <h2>Student Details</h2>
      <p>View all registered students and their room and contact details.</p>

      <form onSubmit={handleSearch} className="inline-form">
        <label>
          Roll Number
          <input
            type="text"
            value={rollFilter}
            onChange={(e) => setRollFilter(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div style={{ marginTop: 8 }}>Loading students...</div>
      ) : students.length === 0 ? (
        <div style={{ marginTop: 8 }}>No students found.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Name</th>
                <th>Branch / Year</th>
                <th>Course</th>
                <th>Room</th>
                <th>Bed</th>
                <th>Parent</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.rollNumber}</td>
                  <td>{s.name}</td>
                  <td>
                    {s.branch} / {s.year}
                  </td>
                  <td>{s.course}</td>
                  <td>
                    {s.room?.roomNumber} ({s.room?.block} / {s.room?.subBlock})
                  </td>
                  <td>{s.bedNumber}</td>
                  <td>
                    {s.parentName} ({s.parentPhone})
                  </td>
                  <td>{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentDetailsPage;

