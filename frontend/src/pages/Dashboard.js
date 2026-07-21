import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StatCard = ({ icon, label, value, color, delay, note }) => (
  <div className="stat-card animate-fade-in" style={{ animationDelay: delay }}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
        <p className="font-black" style={{ fontSize: 34, color, lineHeight: 1 }}>{value}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl animate-float"
        style={{ background: `${color}12`, animationDelay: delay }}>{icon}</div>
    </div>
    {note && <p style={{ color: '#9ca3af', fontSize: 12, borderTop: '1px solid rgba(108,99,255,0.08)', paddingTop: 12 }}>{note}</p>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ problems: 0, submissions: 0 });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const [problemsRes, submissionsRes] = await Promise.all([
            api.get('/problems'),
            user.role === 'student' ? api.get('/submissions/my') : api.get('/problems'),
          ]);
          setStats({
            problems: problemsRes.data.length,
            submissions: user.role === 'student'
              ? submissionsRes.data.length
              : submissionsRes.data.filter(p => p.createdBy._id === user.id).length,
          });
        } catch {}
      };
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb-purple" style={{ width: 600, height: 600, top: -200, left: -200, opacity: 0.7 }} />
        <div className="orb orb-pink"   style={{ width: 450, height: 450, bottom: -100, right: -100, opacity: 0.6 }} />
        <div className="orb orb-green"  style={{ width: 300, height: 300, top: '40%', left: '60%', opacity: 0.5 }} />

        <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in mb-5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.18)', color: '#6c63ff' }}>
            ✨ Where Industry Meets Student Talent
          </div>

          <h1 className="animate-fade-in delay-100 text-center font-black mb-5"
            style={{ fontSize: 'clamp(38px, 7vw, 72px)', lineHeight: 1.1, maxWidth: 780, color: '#1e1e3f' }}>
            Solve Real Problems,{' '}
            <span className="gradient-text">Earn Real Rewards</span>
          </h1>

          <p className="animate-fade-in delay-200 text-center mb-10"
            style={{ color: '#6b7280', fontSize: 'clamp(15px, 2.5vw, 18px)', maxWidth: 520, lineHeight: 1.8 }}>
            Connect with industry challenges. Showcase your skills.
            Build your portfolio. Get noticed by top companies.
          </p>

          <div className="animate-fade-in delay-300 flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/register" className="btn-primary" style={{ padding: '15px 38px', fontSize: 16, textDecoration: 'none', borderRadius: 14 }}>
              Start for Free →
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '15px 38px', fontSize: 16, textDecoration: 'none', borderRadius: 14 }}>
              Login
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-400">
            {[
              { icon: '🎯', title: 'Real Challenges', desc: 'Tackle problems submitted by actual companies and startups.' },
              { icon: '⭐', title: 'Earn Credits',    desc: 'Get rewarded with credits for every accepted solution.' },
              { icon: '🚀', title: 'Build Portfolio', desc: 'Showcase your work to industry recruiters automatically.' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 text-center" style={{ animationDelay: `${400 + i * 100}ms` }}>
                <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ fontSize: 17, color: '#1e1e3f' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -150, right: -150, opacity: 0.5 }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Welcome */}
        <div className="animate-fade-in mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white animate-glow"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1e3f', margin: 0 }}>
                Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0, textTransform: 'capitalize' }}>
                {user.role} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon="⭐" label="Your Credits"   value={user.credits}       color="#10b981" delay="0ms"   note={user.role === 'student' ? 'Earn by solving' : 'Award to students'} />
          <StatCard icon="🎯" label="Open Problems"  value={stats.problems}     color="#6c63ff" delay="100ms" note="Challenges to solve" />
          <StatCard icon={user.role === 'student' ? '📝' : '📌'} label={user.role === 'student' ? 'My Submissions' : 'My Problems'} value={stats.submissions} color="#a855f7" delay="200ms" note={user.role === 'student' ? 'Track progress' : 'Manage postings'} />
          <StatCard icon={user.role === 'student' ? '🎓' : '🏢'} label="Status" value={user.role === 'student' ? 'Student' : 'Industry'} color="#ff6584" delay="300ms" note={user.role === 'student' ? 'Keep learning!' : 'Find talent'} />
        </div>

        {/* Quick Actions */}
        <h2 className="font-bold mb-4" style={{ fontSize: 17, color: '#1e1e3f' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/explore" className="glass-card animate-fade-in delay-400"
            style={{ padding: 32, textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}>
            <div className="orb orb-purple" style={{ width: 200, height: 200, bottom: -80, right: -60, opacity: 0.35 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="text-4xl mb-3 animate-bounce-soft">🔍</div>
              <h3 className="font-bold mb-2" style={{ fontSize: 20, color: '#1e1e3f' }}>Explore Problems</h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                Browse real-world challenges posted by leading industries and start earning.
              </p>
              <span className="inline-flex items-center gap-1 font-semibold" style={{ color: '#6c63ff', fontSize: 14 }}>
                Browse Challenges →
              </span>
            </div>
          </Link>

          {user.role === 'student' ? (
            <Link to="/my-submissions" className="glass-card animate-fade-in delay-500"
              style={{ padding: 32, textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}>
              <div className="orb orb-green" style={{ width: 200, height: 200, bottom: -80, right: -60, opacity: 0.35 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="text-4xl mb-3 animate-bounce-soft" style={{ animationDelay: '0.3s' }}>✅</div>
                <h3 className="font-bold mb-2" style={{ fontSize: 20, color: '#1e1e3f' }}>My Submissions</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  Track all your submissions and review feedback from industry partners.
                </p>
                <span className="inline-flex items-center gap-1 font-semibold" style={{ color: '#059669', fontSize: 14 }}>
                  View Submissions →
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/post-problem" className="glass-card animate-fade-in delay-500"
              style={{ padding: 32, textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}>
              <div className="orb orb-pink" style={{ width: 200, height: 200, bottom: -80, right: -60, opacity: 0.3 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="text-4xl mb-3 animate-bounce-soft" style={{ animationDelay: '0.3s' }}>📝</div>
                <h3 className="font-bold mb-2" style={{ fontSize: 20, color: '#1e1e3f' }}>Post a Problem</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  Create a new challenge and discover talented students to solve it.
                </p>
                <span className="inline-flex items-center gap-1 font-semibold" style={{ color: '#e11d48', fontSize: 14 }}>
                  Post Challenge →
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;