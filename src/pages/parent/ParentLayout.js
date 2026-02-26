import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import ParentDashboard from './ParentDashboard';
import ParentFeesPage from './ParentFeesPage';
import ParentOutingsPage from './ParentOutingsPage';
import ParentNoticesPage from './ParentNoticesPage';
import ParentContactsPage from './ParentContactsPage';
import '../admin/AdminLayout.css';

function ParentLayout() {
  const { logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Parent Portal</div>
        <nav>
          <NavLink to="/parent" end>
            Dashboard
          </NavLink>
          <NavLink to="/parent/fees">Fees</NavLink>
          <NavLink to="/parent/outings">Outing Requests</NavLink>
          <NavLink to="/parent/notices">Notices</NavLink>
          <NavLink to="/parent/contacts">Contact Details</NavLink>
        </nav>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<ParentDashboard />} />
          <Route path="fees" element={<ParentFeesPage />} />
          <Route path="outings" element={<ParentOutingsPage />} />
          <Route path="notices" element={<ParentNoticesPage />} />
          <Route path="contacts" element={<ParentContactsPage />} />
          <Route path="*" element={<Navigate to="/parent" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default ParentLayout;

