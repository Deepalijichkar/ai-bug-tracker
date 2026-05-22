import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🐛 <span style={styles.brandText}>BugTracker AI</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <span style={styles.userName}>{user?.name}</span>
        <Link to="/create" style={styles.button}>+ New Bug</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e1e2e',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.3rem',
  },
  brandText: {
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#7c3aed',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  userName: { color: '#e5e7eb', fontSize: '0.9rem' },
  button: {
    backgroundColor: '#7c3aed',
    color: 'white',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  logout: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid #374151',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  }
};

export default Navbar;