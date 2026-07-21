import { useEffect, useState } from 'react';
import SubmissionCard from '../components/SubmissionCard';
import Loader from '../components/Loader';
import api from '../services/api';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try { const res = await api.get('/submissions/my'); setSubmissions(res.data); }
      catch { setError('Failed to load submissions'); }
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = { all: submissions.length, pending: submissions.filter(s => s.status==='pending').length, accepted: submissions.filter(s=>s.status==='accepted').length, rejected: submissions.filter(s=>s.status==='rejected').length };

  if (loading) return <Loader text="Loading your submissions..." />;

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <div className="orb orb-purple" style={{ width:500, height:500, top:-200, right:-200, opacity:0.4 }} />

      <div className="page-container" style={{ position:'relative', zIndex:1 }}>
        <div className="animate-fade-in mb-8">
          <h1 className="font-black mb-2" style={{ fontSize:'clamp(26px,5vw,42px)', color:'#1e1e3f' }}>
            My <span className="gradient-text">Submissions</span>
          </h1>
          <p style={{ color:'#6b7280', fontSize:15 }}>Track all your solutions and industry feedback</p>
        </div>

        {/* Filter stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in delay-100">
          {[
            { key:'all',      label:'Total',    color:'#6c63ff', icon:'📊' },
            { key:'pending',  label:'Pending',  color:'#d97706', icon:'⏳' },
            { key:'accepted', label:'Accepted', color:'#059669', icon:'✅' },
            { key:'rejected', label:'Rejected', color:'#ef4444', icon:'❌' },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className="text-left rounded-xl p-4 transition-all duration-300"
              style={{
                background: filter===s.key ? `${s.color}0d` : 'white',
                border: filter===s.key ? `1.5px solid ${s.color}40` : '1.5px solid rgba(108,99,255,0.1)',
                cursor:'pointer', transform: filter===s.key ? 'scale(1.03)' : 'scale(1)',
                boxShadow: filter===s.key ? `0 4px 16px ${s.color}18` : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
              <p style={{ color:s.color, fontSize:24, fontWeight:900, lineHeight:1 }}>{counts[s.key]}</p>
              <p style={{ color:'#6b7280', fontSize:12, marginTop:4 }}>{s.label}</p>
            </button>
          ))}
        </div>

        {error && <div className="alert-error mb-5">⚠ {error}</div>}

        {filtered.length === 0 ? (
          <div className="empty-state glass-card animate-fade-in" style={{ padding:'60px 24px' }}>
            <span className="empty-state-icon">📭</span>
            <h3 className="font-bold mb-2" style={{ fontSize:18, color:'#1e1e3f' }}>
              {filter==='all' ? 'No submissions yet' : `No ${filter} submissions`}
            </h3>
            <p style={{ color:'#6b7280' }}>{filter==='all' ? 'Browse problems and submit your first solution!' : 'Change the filter above.'}</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {filtered.map((sub, i) => <SubmissionCard key={sub._id} submission={sub} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;