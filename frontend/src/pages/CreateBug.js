import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateBug() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://ai-bug-tracker-omega.vercel.app/api/auth/users')
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://ai-bug-tracker-omega.vercel.app/api/bugs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create New Bug</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required style={{ ...styles.input, height: '120px' }} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Assign To</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} style={styles.input}>
            <option value="">-- Unassigned --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Creating... (AI analyzing)' : 'Create Bug'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  field: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.9rem', fontWeight: '500' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', width: '100%' },
  button: { backgroundColor: '#7c3aed', color: 'white', padding: '0.7rem 2rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }
};

export default CreateBug;