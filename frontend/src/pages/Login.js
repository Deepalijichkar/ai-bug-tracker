import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://ai-bug-tracker-omega.vercel.app/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🐛 BugTracker AI</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder="you@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={styles.input} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={{ color: '#7c3aed' }}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.3rem' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' },
  input: { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' },
  button: { width: '100%', padding: '0.8rem', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', marginTop: '0.5rem' },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.7rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }
};

export default Login;