import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role: currentRole, login } = useAuth();

  useEffect(() => {
    if (currentRole === 'admin') navigate('/admin');
    if (currentRole === 'student') navigate('/student');
    if (currentRole === 'parent') navigate('/parent');
  }, [currentRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password, role });
      login(res.data);
      if (role === 'admin') navigate('/admin');
      if (role === 'student') navigate('/student');
      if (role === 'parent') navigate('/parent');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAdmin = async () => {
    try {
      const res = await api.get('/auth/seed-demo');
      setUsername(res.data.username);
      setPassword(res.data.password);
      setRole('admin');
      setError(`Demo admin ready. Username: ${res.data.username}, Password: ${res.data.password}`);
    } catch (err) {
      console.error(err);
      setError('Failed to seed demo admin');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Geetanjali Hostel Management</h1>
        <p className="subtitle">Login as Admin, Student, or Parent</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </label>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button type="button" className="secondary-btn" onClick={handleSeedAdmin}>
          Use Demo Admin
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

