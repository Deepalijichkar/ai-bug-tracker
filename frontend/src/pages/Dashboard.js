import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    axios.get('https://ai-bug-tracker-omega.vercel.app/api/bugs')
      .then(res => setBugs(res.data))
      .catch(err => console.log(err));
  }, []);

  const priorityColor = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c3aed'
  };

  const statusColor = {
    'open': '#dbeafe',
    'in-progress': '#fef3c7',
    'resolved': '#dcfce7'
  };

  const statusTextColor = {
    'open': '#1d4ed8',
    'in-progress': '#92400e',
    'resolved': '#166534'
  };

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'open').length,
    inProgress: bugs.filter(b => b.status === 'in-progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
  };

  return (
    <div>
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Bugs</p>
          <p style={styles.statNumber}>{stats.total}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Open</p>
          <p style={{ ...styles.statNumber, color: '#ef4444' }}>{stats.open}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>In Progress</p>
          <p style={{ ...styles.statNumber, color: '#f59e0b' }}>{stats.inProgress}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Resolved</p>
          <p style={{ ...styles.statNumber, color: '#22c55e' }}>{stats.resolved}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', fontWeight: '600' }}>All Bugs</h2>

      {bugs.length === 0 && (
        <div style={styles.empty}>
          <p>🎉 No bugs found! Click "+ New Bug" to create one.</p>
        </div>
      )}

      {bugs.map(bug => (
        <Link to={`/bug/${bug._id}`} key={bug._id} style={{ textDecoration: 'none' }}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ color: '#111827', margin: 0, fontSize: '1rem' }}>{bug.title}</h3>
              <span style={{ ...styles.badge, backgroundColor: priorityColor[bug.priority] }}>
                {bug.priority}
              </span>
            </div>
            <p style={styles.desc}>{bug.description.substring(0, 120)}...</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ ...styles.statusBadge, backgroundColor: statusColor[bug.status], color: statusTextColor[bug.status] }}>
                {bug.status}
              </span>
              {bug.tags?.slice(0, 3).map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles = {
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.2rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  statLabel: { color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.3rem' },
  statNumber: { fontSize: '2rem', fontWeight: '700', color: '#111827' },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '0.8rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
    borderLeft: '4px solid #7c3aed',
  },
  badge: {
    color: 'white',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
  },
  desc: { color: '#6b7280', fontSize: '0.9rem', margin: '0.5rem 0' },
  empty: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '3rem',
    textAlign: 'center',
    color: '#6b7280',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }
};

export default Dashboard;