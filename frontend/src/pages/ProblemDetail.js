import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import api from '../services/api';

const domainConfig = {
  'Web Development':    { icon:'🌐', color:'#6c63ff', bg:'rgba(108,99,255,0.08)' },
  'AI/ML':             { icon:'🤖', color:'#e11d48', bg:'rgba(225,29,72,0.07)'  },
  'Mobile Development':{ icon:'📱', color:'#059669', bg:'rgba(5,150,105,0.08)'  },
  'DevOps':            { icon:'⚙️', color:'#d97706', bg:'rgba(217,119,6,0.08)'  },
  'Data Science':      { icon:'📊', color:'#2563eb', bg:'rgba(37,99,235,0.08)'  },
  'System Design':     { icon:'🏗️', color:'#7c3aed', bg:'rgba(124,58,237,0.08)' },
};
const difficultyConfig = {
  easy:   { label:'Easy',   tagClass:'tag-green',  color:'#10b981' },
  medium: { label:'Medium', tagClass:'tag-yellow', color:'#f59e0b' },
  hard:   { label:'Hard',   tagClass:'tag-red',    color:'#ef4444' },
};

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try { const res = await api.get(`/problems/${id}`); setProblem(res.data); }
      catch {}
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  if (loading) return <Loader text="Loading challenge..." />;
  if (!problem) return (
    <div className="empty-state" style={{ minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
      <span className="empty-state-icon">❌</span>
      <h3 style={{ color:'#1e1e3f',fontSize:20,fontWeight:700 }}>Problem not found</h3>
      <button onClick={() => navigate('/explore')} className="btn-secondary mt-4">← Back to Explore</button>
    </div>
  );

  const domain   = domainConfig[problem.domain] || { icon:'💡', color:'#6c63ff', bg:'rgba(108,99,255,0.08)' };
  const diff     = difficultyConfig[problem.difficulty] || difficultyConfig.easy;
  const daysLeft = Math.ceil((new Date(problem.deadline) - new Date()) / (1000*60*60*24));
  const isExpired = daysLeft < 0;
  const isUrgent  = !isExpired && daysLeft <= 3;

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <div className="orb orb-purple" style={{ width:500,height:500,top:-200,left:-150,opacity:0.4 }} />
      <div className="orb orb-pink"   style={{ width:400,height:400,bottom:0,right:-100,opacity:0.3 }} />

      <div className="page-container" style={{ position:'relative',zIndex:1,maxWidth:840 }}>
        <button onClick={() => navigate(-1)} style={{ background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:14,fontFamily:'Inter,sans-serif',marginBottom:24,display:'flex',alignItems:'center',gap:6 }}
          onMouseEnter={e => e.currentTarget.style.color='#1e1e3f'} onMouseLeave={e => e.currentTarget.style.color='#6b7280'}>
          ← Back
        </button>

        <div className="glass-card animate-fade-in" style={{ padding:0,overflow:'hidden' }}>
          {/* Hero */}
          <div style={{ height:100, background:`linear-gradient(135deg,${domain.color}20,rgba(255,255,255,0))`, display:'flex',alignItems:'flex-end',padding:'0 32px 20px', borderBottom:'1px solid rgba(108,99,255,0.08)' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background:domain.bg,border:`1px solid ${domain.color}30` }}>
              <span style={{ fontSize:20 }}>{domain.icon}</span>
              <span style={{ color:domain.color,fontSize:13,fontWeight:600 }}>{problem.domain}</span>
            </div>
          </div>

          <div style={{ padding:'0 32px 32px' }}>
            <div className="flex flex-wrap items-start gap-3 mt-6 mb-6">
              <h1 className="font-black" style={{ fontSize:'clamp(20px,4vw,30px)',color:'#1e1e3f',flex:1,minWidth:200,lineHeight:1.3 }}>
                {problem.title}
              </h1>
              <span className={`tag ${diff.tagClass}`} style={{ marginTop:4 }}>
                <span style={{ width:5,height:5,borderRadius:'50%',background:diff.color,display:'inline-block' }} />
                {diff.label}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
              {[
                { icon:'⭐', label:'Credits', value:`${problem.creditsReward} pts`, color:'#059669' },
                { icon:'📅', label:'Deadline', value:new Date(problem.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), color:'#6c63ff' },
                { icon:'⏳', label:'Days Left', value:isExpired?'Expired':`${daysLeft}d`, color:isExpired?'#ef4444':isUrgent?'#f59e0b':'#059669' },
                { icon:'🎯', label:'Difficulty', value:diff.label, color:diff.color },
              ].map((s,i) => (
                <div key={i} className="rounded-xl p-4" style={{ background:'#f8f9ff',border:'1px solid rgba(108,99,255,0.1)' }}>
                  <p style={{ color:'#9ca3af',fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:5 }}>{s.label}</p>
                  <p className="font-bold" style={{ color:s.color,fontSize:16 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-2xl p-6 mb-6" style={{ background:'#f8f9ff',border:'1px solid rgba(108,99,255,0.08)' }}>
              <h2 className="font-bold mb-3" style={{ fontSize:13,color:'#6c63ff',letterSpacing:'0.05em',textTransform:'uppercase' }}>📋 About this Challenge</h2>
              <p style={{ color:'#374151',fontSize:15,lineHeight:1.8 }}>{problem.description}</p>
            </div>

            {/* Posted by */}
            <div className="flex items-center gap-4 rounded-2xl p-4 mb-7" style={{ background:'#f8f9ff',border:'1px solid rgba(108,99,255,0.08)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl text-white"
                style={{ background:'linear-gradient(135deg,#6c63ff,#a855f7)',flexShrink:0 }}>
                {problem.createdBy?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ color:'#1e1e3f',fontWeight:700,fontSize:15 }}>{problem.createdBy?.name}</p>
                <p style={{ color:'#9ca3af',fontSize:13 }}>{problem.createdBy?.email} · Industry Partner</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {user?.role === 'student' && !isExpired && (
                <Link to={`/submit/${id}`} className="btn-success" style={{ textDecoration:'none',textAlign:'center',minWidth:180,borderRadius:14,fontSize:15,padding:'13px 28px' }}>
                  🚀 Submit Solution
                </Link>
              )}
              {user?.role === 'industry' && problem.createdBy?._id === user.id && (
                <Link to={`/review/${id}`} className="btn-primary" style={{ textDecoration:'none',textAlign:'center',minWidth:180,borderRadius:14,fontSize:15,padding:'13px 28px' }}>
                  🤖 Review Submissions
                </Link>
              )}
              <Link to="/explore" className="btn-secondary" style={{ textDecoration:'none',borderRadius:14,fontSize:15,padding:'13px 28px' }}>
                ← Explore More
              </Link>
            </div>

            {isExpired && <div className="alert-error mt-4">⏰ This challenge has expired and is no longer accepting submissions.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;