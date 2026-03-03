import React, { useEffect, useState } from 'react';
import api from '../../api';

function StudentContactsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/student/contacts');
      setContacts(res.data);
    };
    load();
  }, []);

  return (
    <div>
      <h2>Important Contacts</h2>
      <p>Contact details of Doctor, HOD, Admin and Warden provided by hostel admin.</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.role}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4}>No contacts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentContactsPage;

