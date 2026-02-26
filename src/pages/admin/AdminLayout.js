import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AdminDashboard from './AdminDashboard';
import RoomsPage from './RoomsPage';
import FeesPage from './FeesPage';
import ComplaintsPage from './ComplaintsPage';
import NoticesPage from './NoticesPage';
import OutingsPage from './OutingsPage';
import StudentRegistrationPage from './StudentRegistrationPage';
import VacatePage from './VacatePage';
import StudentDetailsPage from './StudentDetailsPage';
import ContactsPage from './ContactsPage';
import './AdminLayout.css';

function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Admin Panel</div>
        <nav>
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/rooms">Rooms</NavLink>
          <NavLink to="/admin/fees">Fees</NavLink>
          <NavLink to="/admin/complaints">Complaints</NavLink>
          <NavLink to="/admin/notices">Notices</NavLink>
          <NavLink to="/admin/outings">Outing Requests</NavLink>
          <NavLink to="/admin/register-student">Student Registration</NavLink>
          <NavLink to="/admin/vacate">Vacate</NavLink>
          <NavLink to="/admin/students">Student Details</NavLink>
          <NavLink to="/admin/contacts">Contact Details</NavLink>
        </nav>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="outings" element={<OutingsPage />} />
          <Route path="register-student" element={<StudentRegistrationPage />} />
          <Route path="vacate" element={<VacatePage />} />
          <Route path="students" element={<StudentDetailsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminLayout;

