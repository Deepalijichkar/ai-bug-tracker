import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [fixSuggestion, setFixSuggestion] = useState(null);
  const [fixLoading, setFixLoading] = useState(false);

  useEffect(() => {
    axios.get(`https://ai-bug-tracker-omega.vercel.app/api/bugs/${id}`)
      .then(res => setBug(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(`https://ai-bug-tracker-omega.vercel.app/api/bugs/${id}`, { status });
      setBug(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBug = async () => {
    try {
      await axios.delete(`https://ai-bug-tracker-omega.vercel.app/api/bugs/${id}`);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const getFixSuggestion = async () => {
    setFixLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `https://ai-bug-tracker-omega.vercel.app/api/bugs/${id}/fix-suggestion`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFixSuggestion(res.data);
    } catch (err) {
      console.log(err);
    }
    setFixLoading(false);
  };

  if (!bug) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{bug.title}</h1>
          <span style={{ ...styles.badge, backgroundColor: priorityColor[bug.priority] }}>{bug.priority}</span>
        </div>

        <p style={{ color: '#6b7280', marginTop: '1rem', lineHeight: '1.6' }}>{bug.description}</p>

        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Status</span>
            <span style={{ ...styles.statusBadge, backgroundColor: statusColor[bug.status], color: statusTextColor[bug.status] }}>{bug.status}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Reported By</span>
            <span style={styles.metaValue}>👤 {bug.createdBy?.name || 'Unknown'}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Assigned To</span>
            <span style={styles.metaValue}>{bug.assignedTo ? `👤 ${bug.assignedTo.name}` : '— Unassigned'}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Created</span>
            <span style={styles.metaValue}>{new Date(bug.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {bug.aiSummary && (
          <div style={styles.aiBox}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#7c3aed' }}>🤖 AI Analysis</h3>
            <p><strong>Summary:</strong> {bug.aiSummary}</p>
            <p style={{ marginTop: '0.3rem' }}><strong>AI Severity:</strong> {bug.aiSeverity}</p>
            {bug.tags?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Tags: </strong>
                {bug.tags.map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {!fixSuggestion && (
          <button onClick={getFixSuggestion} disabled={fixLoading} style={styles.fixBtn}>
            {fixLoading ? '🤖 AI is analyzing the fix...' : '✨ Get AI Fix Suggestion'}
          </button>
        )}

        {fixSuggestion && (
          <div style={styles.fixBox}>
            <h3 style={{ margin: '0 0 1rem', color: '#065f46' }}>✨ AI Fix Suggestion</h3>
            <div style={styles.fixSection}>
              <p style={styles.fixLabel}>🔍 Root Cause</p>
              <p style={styles.fixText}>{fixSuggestion.rootCause}</p>
            </div>
            <div style={styles.fixSection}>
              <p style={styles.fixLabel}>🛠️ Fix Steps</p>
              {fixSuggestion.steps?.map((step, i) => (
                <div key={i} style={styles.stepRow}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{step}</p>
                </div>
              ))}
            </div>
            {fixSuggestion.codeHint && (
              <div style={styles.fixSection}>
                <p style={styles.fixLabel}>💻 Code Hint</p>
                <pre style={styles.codeBlock}>{fixSuggestion.codeHint}</pre>
              </div>
            )}
            <div style={styles.fixSection}>
              <p style={styles.fixLabel}>⏱️ Estimated Fix Time</p>
              <p style={styles.fixText}>{fixSuggestion.estimatedTime}</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => updateStatus('open')} style={styles.btnSecondary}>Mark Open</button>
          <button onClick={() => updateStatus('in-progress')} style={styles.btnSecondary}>Mark In Progress</button>
          <button onClick={() => updateStatus('resolved')} style={styles.btnSecondary}>Mark Resolved</button>
          <button onClick={deleteBug} style={styles.btnDanger}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };
const statusColor = { 'open': '#dbeafe', 'in-progress': '#fef3c7', 'resolved': '#dcfce7' };
const statusTextColor = { 'open': '#1d4ed8', 'in-progress': '#92400e', 'resolved': '#166534' };

const styles = {
  back: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem', color: '#7c3aed', padding: 0 },
  card: { backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  badge: { color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  statusBadge: { padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  metaRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  metaLabel: { fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' },
  metaValue: { fontSize: '0.9rem', color: '#111827', fontWeight: '500' },
  aiBox: { backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem' },
  tag: { backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', marginRight: '0.5rem' },
  fixBtn: { marginTop: '1.5rem', width: '100%', padding: '0.8rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  fixBox: { backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '1.2rem', marginTop: '1.5rem' },
  fixSection: { marginBottom: '1rem' },
  fixLabel: { fontSize: '0.8rem', fontWeight: '700', color: '#065f46', textTransform: 'uppercase', marginBottom: '0.4rem' },
  fixText: { fontSize: '0.9rem', color: '#111827', margin: 0 },
  stepRow: { display: 'flex', gap: '0.8rem', alignItems: 'flex-start', marginBottom: '0.5rem' },
  stepNum: { backgroundColor: '#059669', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 },
  codeBlock: { backgroundColor: '#1e1e2e', color: '#a78bfa', padding: '1rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto', margin: 0 },
  btnSecondary: { backgroundColor: '#7c3aed', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnDanger: { backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default BugDetail;