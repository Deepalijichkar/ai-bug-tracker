import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://ai-bug-tracker-omega.vercel.app';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    const headers = getHeaders();
    axios.get(`${API}/api/projects/${id}`, { headers })
      .then(res => setProject(res.data));
    axios.get(`${API}/api/bugs?project=${id}`, { headers })
      .then(res => setBugs(res.data));
  }, [id, getHeaders]);

  const addMember = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/projects/${id}/members`, { email }, { headers: getHeaders() });
      setProject(res.data);
      setEmail('');
      setMessage('Member added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'User not found');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };

  if (!project) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate('/projects')} style={styles.back}>← Back to Projects</button>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>📁 {project.name}</h1>
          <p style={{ color: '#6b7280', marginTop: '0.3rem' }}>{project.description}</p>
        </div>
        <button onClick={() => navigate(`/create?project=${id}`)} style={styles.button}>+ New Bug</button>
      </div>
      <div style={styles.grid}>
        <div style={styles.mainSection}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Bugs ({bugs.length})</h2>
          {bugs.length === 0 && (
            <div style={styles.empty}>No bugs yet in this project!</div>
          )}
          {bugs.map(bug => (
            <div key={bug._id} style={styles.bugCard} onClick={() => navigate(`/bug/${bug._id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{bug.title}</h3>
                <span style={{ ...styles.badge, backgroundColor: priorityColor[bug.priority] }}>{bug.priority}</span>
              </div>
              <p style={styles.bugDesc}>{bug.description.substring(0, 100)}...</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={styles.statusBadge}>{bug.status}</span>
                {bug.assignedTo && <span style={styles.assignedBadge}>👤 {bug.assignedTo.name}</span>}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={styles.sideCard}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>👥 Team Members</h3>
            {project.members?.map(member => (
              <div key={member._id} style={styles.memberRow}>
                <div style={styles.avatar}>{member.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{member.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>{member.email}</p>
                </div>
                {project.owner?._id === member._id && (
                  <span style={styles.ownerBadge}>Owner</span>
                )}
              </div>
            ))}
          </div>
          <div style={styles.sideCard}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>➕ Invite Member</h3>
            {message && <p style={{ color: message.includes('success') ? '#22c55e' : '#ef4444', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{message}</p>}
            <form onSubmit={addMember}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teammate@email.com" required style={styles.input} />
              <button type="submit" style={{ ...styles.button, width: '100%', marginTop: '0.5rem' }}>Invite</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  back: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem', color: '#7c3aed', padding: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  button: { backgroundColor: '#7c3aed', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' },
  mainSection: {},
  bugCard: { backgroundColor: 'white', borderRadius: '10px', padding: '1rem', marginBottom: '0.8rem', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #7c3aed' },
  badge: { color: 'white', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  bugDesc: { color: '#6b7280', fontSize: '0.85rem', margin: '0.4rem 0 0' },
  statusBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' },
  assignedBadge: { backgroundColor: '#f3f4f6', color: '#6b7280', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' },
  empty: { backgroundColor: 'white', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#9ca3af' },
  sideCard: { backgroundColor: 'white', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  memberRow: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 },
  ownerBadge: { marginLeft: 'auto', backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  input: { width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }
};

export default ProjectDetail;