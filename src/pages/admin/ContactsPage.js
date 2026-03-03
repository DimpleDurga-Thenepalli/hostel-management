import React, { useEffect, useState } from 'react';
import api from '../../api';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    role: 'Doctor',
    phone: '',
    email: '',
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await api.get('/admin/contacts');
    setContacts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/admin/contacts/${editingId}`, form);
    } else {
      await api.post('/admin/contacts', form);
    }
    setForm({ name: '', role: 'Doctor', phone: '', email: '' });
    setEditingId(null);
    await load();
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      role: c.role,
      phone: c.phone,
      email: c.email || '',
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/contacts/${id}`);
    await load();
  };

  return (
    <div>
      <h2>Contact Details</h2>
      <p>
        Maintain important contacts like Doctor, HOD, Admin, and Warden. These are visible
        in all three portals.
      </p>

      <form onSubmit={handleSubmit} className="form-grid">
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
          Role
          <select
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <option value="Doctor">Doctor</option>
            <option value="HOD">HOD</option>
            <option value="Admin">Admin</option>
            <option value="Warden">Warden</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Phone
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
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
        <button type="submit">{editingId ? 'Update Contact' : 'Add Contact'}</button>
      </form>

      <div className="table-wrapper" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.role}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5}>No contacts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContactsPage;

