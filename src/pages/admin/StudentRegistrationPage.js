import React, { useEffect, useState } from 'react';
import api from '../../api';

function StudentRegistrationPage() {
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    year: '',
    course: 'btech',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    feeTotal: '',
    feeDueDate: '',
    block: 'men',
    subBlock: 'ac',
    roomId: '',
    studentUsername: '',
    studentPassword: '',
    parentUsername: '',
    parentPassword: '',
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState('');

  const loadRooms = async (block, subBlock) => {
    const res = await api.get('/admin/rooms/available', { params: { block, subBlock } });
    setAvailableRooms(res.data);
  };

  useEffect(() => {
    loadRooms(form.block, form.subBlock);
  }, [form.block, form.subBlock]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleBlockChange = async (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    updated.roomId = '';
    await loadRooms(updated.block, updated.subBlock);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        ...form,
        feeTotal: form.feeTotal ? Number(form.feeTotal) : 0,
      };
      await api.post('/admin/students', payload);
      setMessage('Student registered successfully.');
      setForm((f) => ({
        ...f,
        name: '',
        rollNumber: '',
        branch: '',
        year: '',
        phone: '',
        email: '',
        parentName: '',
        parentPhone: '',
        feeTotal: '',
        feeDueDate: '',
        roomId: '',
        studentUsername: '',
        studentPassword: '',
        parentUsername: '',
        parentPassword: '',
      }));
    } catch (e) {
      console.error(e);
      setMessage(e.response?.data?.message || 'Failed to register student');
    }
  };

  return (
    <div>
      <h2>Student Registration</h2>
      <p>
        Register new hostel students, assign rooms, and create login credentials for both
        student and parent.
      </p>

      {message && <div style={{ marginBottom: 8 }}>{message}</div>}

      <form onSubmit={handleSubmit} className="form-grid">
        <h3>Student Details</h3>
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </label>
        <label>
          Roll Number
          <input
            type="text"
            value={form.rollNumber}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            required
          />
        </label>
        <label>
          Branch
          <input
            type="text"
            value={form.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
          />
        </label>
        <label>
          Year
          <input
            type="text"
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
          />
        </label>
        <label>
          Course
          <select
            value={form.course}
            onChange={(e) => handleChange('course', e.target.value)}
          >
            <option value="btech">B.Tech</option>
            <option value="diploma">Diploma</option>
          </select>
        </label>
        <label>
          Phone
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </label>
        <label>
          Parent Name
          <input
            type="text"
            value={form.parentName}
            onChange={(e) => handleChange('parentName', e.target.value)}
          />
        </label>
        <label>
          Parent Phone
          <input
            type="text"
            value={form.parentPhone}
            onChange={(e) => handleChange('parentPhone', e.target.value)}
          />
        </label>

        <h3>Fee Setup</h3>
        <label>
          Total Fee
          <input
            type="number"
            value={form.feeTotal}
            onChange={(e) => handleChange('feeTotal', e.target.value)}
          />
        </label>
        <label>
          Due Date
          <input
            type="date"
            value={form.feeDueDate}
            onChange={(e) => handleChange('feeDueDate', e.target.value)}
          />
        </label>

        <h3>Room Allocation</h3>
        <label>
          Block
          <select
            value={form.block}
            onChange={(e) => handleBlockChange('block', e.target.value)}
          >
            <option value="men">Men&apos;s Block</option>
            <option value="women">Women&apos;s Block</option>
          </select>
        </label>
        <label>
          Sub Block
          <select
            value={form.subBlock}
            onChange={(e) => handleBlockChange('subBlock', e.target.value)}
          >
            <option value="ac">AC</option>
            <option value="non-ac">Non-AC</option>
          </select>
        </label>
        <label>
          Room
          <select
            value={form.roomId}
            onChange={(e) => handleChange('roomId', e.target.value)}
            required
          >
            <option value="">Select room</option>
            {availableRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} (Available beds: {r.availableBeds})
              </option>
            ))}
          </select>
        </label>

        <h3>Login Credentials</h3>
        <label>
          Student Username
          <input
            type="text"
            value={form.studentUsername}
            onChange={(e) => handleChange('studentUsername', e.target.value)}
            required
          />
        </label>
        <label>
          Student Password
          <input
            type="password"
            value={form.studentPassword}
            onChange={(e) => handleChange('studentPassword', e.target.value)}
            required
          />
        </label>
        <label>
          Parent Username
          <input
            type="text"
            value={form.parentUsername}
            onChange={(e) => handleChange('parentUsername', e.target.value)}
            required
          />
        </label>
        <label>
          Parent Password
          <input
            type="password"
            value={form.parentPassword}
            onChange={(e) => handleChange('parentPassword', e.target.value)}
            required
          />
        </label>

        <button type="submit" style={{ marginTop: 12 }}>
          Register Student
        </button>
      </form>
    </div>
  );
}

export default StudentRegistrationPage;

