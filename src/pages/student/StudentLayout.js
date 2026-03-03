import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import StudentDashboard from './StudentDashboard';
import StudentFeesPage from './StudentFeesPage';
import StudentComplaintsPage from './StudentComplaintsPage';
import StudentNoticesPage from './StudentNoticesPage';
import StudentOutingsPage from './StudentOutingsPage';
import StudentContactsPage from './StudentContactsPage';
import '../admin/AdminLayout.css';

function StudentLayout() {
  const { logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Student Portal</div>
        <nav>
          <NavLink to="/student" end>
            Dashboard
          </NavLink>
          <NavLink to="/student/fees">Fees</NavLink>
          <NavLink to="/student/complaints">Complaints</NavLink>
          <NavLink to="/student/notices">Notices</NavLink>
          <NavLink to="/student/outings">Outing Requests</NavLink>
          <NavLink to="/student/contacts">Contact Details</NavLink>
        </nav>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<StudentDashboard />} />
          <Route path="fees" element={<StudentFeesPage />} />
          <Route path="complaints" element={<StudentComplaintsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
          <Route path="outings" element={<StudentOutingsPage />} />
          <Route path="contacts" element={<StudentContactsPage />} />
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default StudentLayout;

