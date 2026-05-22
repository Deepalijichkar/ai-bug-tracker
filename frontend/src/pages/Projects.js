import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('https://ai-bug-tracker-omega.vercel.app/api/projects', { headers })
      .then(res => setProjects(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://ai-bug-tracker-omega.vercel.app/api/projects', form, { headers });
      setProjects([...projects, res.data]);
      setForm({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Projects</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          + New Project
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <div style={styles.field}>
              <label style={styles.label}>Project Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={styles.input}
                placeholder="E-commerce App"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ ...styles.input, height: '80px' }}
                placeholder="What is this project about?"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 && !showForm && (
        <div style={styles.empty}>
          <p>🚀 No projects yet. Create your first project!</p>
        </div>
      )}

      <div style={styles.grid}>
        {projects.map(project => (
          <div key={project._id} style={styles.card} onClick={() => navigate(`/projects/${project._id}`)}>
            <div style={styles.cardIcon}>📁</div>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{project.name}</h3>
            <p style={styles.desc}>{project.description || 'No description'}</p>
            <div style={styles.cardFooter}>
              <span style={styles.memberCount}>👥 {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
              <span style={styles.owner}>by {project.owner?.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  button: { backgroundColor: '#7c3aed', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { backgroundColor: 'transparent', color: '#6b7280', padding: '0.6rem 1.2rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  formCard: { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' },
  input: { width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' },
  empty: { backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#6b7280', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', borderTop: '4px solid #7c3aed', transition: 'transform 0.15s' },
  cardIcon: { fontSize: '2rem' },
  desc: { color: '#6b7280', fontSize: '0.9rem', margin: '0.3rem 0 1rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  memberCount: { fontSize: '0.8rem', color: '#6b7280' },
  owner: { fontSize: '0.8rem', color: '#9ca3af' }
};

export default Projects;