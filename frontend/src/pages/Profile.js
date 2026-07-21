import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="empty-state" style={{ minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
      <span className="empty-state-icon">🔒</span>
      <h3 style={{ color:'#1e1e3f',fontSize:20,fontWeight:700,marginBottom:12 }}>Please login to view your profile</h3>
      <Link to="/login" className="btn-primary" style={{ textDecoration:'none',padding:'12px 28px' }}>Sign In</Link>
    </div>
  );

  const initials = user.name.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0,2);

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <div className="orb orb-purple" style={{ width:500, height:500, top:-200, right:-200, opacity:0.4 }} />
      <div className="orb orb-green"  style={{ width:400, height:400, bottom:0, left:-100, opacity:0.3 }} />

      <div className="page-container" style={{ position:'relative', zIndex:1, maxWidth:760 }}>

        {/* Hero Card */}
        <div className="glass-card animate-fade-in mb-6" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ height:110, background: user.role==='student'
            ? 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(168,85,247,0.1),rgba(16,185,129,0.08))'
            : 'linear-gradient(135deg,rgba(255,101,132,0.12),rgba(108,99,255,0.1),rgba(245,158,11,0.08))' }} />
          <div style={{ padding:'0 28px 28px' }}>
            <div style={{ marginTop:-44, marginBottom:16 }}>
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-4xl text-white animate-glow"
                style={{ background: user.role==='student' ? 'linear-gradient(135deg,#6c63ff,#a855f7)' : 'linear-gradient(135deg,#ff6584,#ef4444)',
                  border:'3px solid white', boxShadow:'0 8px 24px rgba(108,99,255,0.2)', fontFamily:'Space Grotesk,sans-serif' }}>
                {initials}
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-black mb-1" style={{ fontSize:26, color:'#1e1e3f' }}>{user.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`tag ${user.role==='student'?'tag-purple':'tag-red'}`}>
                    {user.role==='student'?'🎓':'🏢'} {user.role.charAt(0).toUpperCase()+user.role.slice(1)}
                  </span>
                  <span className="tag tag-green">✓ Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats + Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 animate-fade-in delay-100">
          <div className="glass-card" style={{ padding:24, textAlign:'center', borderTop:'3px solid #10b981' }}>
            <div className="text-3xl mb-2 animate-float">⭐</div>
            <p className="font-black gradient-text-green" style={{ fontSize:38 }}>{user.credits}</p>
            <p style={{ color:'#6b7280', fontSize:13, marginTop:4 }}>Total Credits</p>
            <p style={{ color:'#9ca3af', fontSize:11, marginTop:6 }}>{user.role==='student'?'Earn by solving':'Award to students'}</p>
          </div>

          <div className="glass-card md:col-span-2" style={{ padding:24 }}>
            <h2 style={{ fontSize:12, fontWeight:700, color:'#9ca3af', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:16 }}>Account Information</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { label:'Full Name',    value:user.name,  icon:'👤' },
                { label:'Email',        value:user.email, icon:'📧' },
                { label:'Account Type', value:user.role.charAt(0).toUpperCase()+user.role.slice(1), icon: user.role==='student'?'🎓':'🏢' },
              ].map((item,i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background:'#f8f9ff' }}>
                  <span style={{ fontSize:18, width:28, textAlign:'center' }}>{item.icon}</span>
                  <div>
                    <p style={{ color:'#9ca3af', fontSize:10, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>{item.label}</p>
                    <p style={{ color:'#1e1e3f', fontSize:14, fontWeight:500, marginTop:2 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in delay-200">
          <Link to="/explore" className="glass-card flex items-center gap-4" style={{ padding:'18px 22px', textDecoration:'none' }}>
            <span style={{ fontSize:26 }}>🎯</span>
            <div>
              <p className="font-bold" style={{ color:'#1e1e3f', fontSize:14 }}>Browse Challenges</p>
              <p style={{ color:'#6b7280', fontSize:12 }}>Find problems to solve</p>
            </div>
            <span style={{ color:'#9ca3af', marginLeft:'auto' }}>→</span>
          </Link>
          {user.role==='student' ? (
            <Link to="/my-submissions" className="glass-card flex items-center gap-4" style={{ padding:'18px 22px', textDecoration:'none' }}>
              <span style={{ fontSize:26 }}>📝</span>
              <div>
                <p className="font-bold" style={{ color:'#1e1e3f', fontSize:14 }}>My Submissions</p>
                <p style={{ color:'#6b7280', fontSize:12 }}>Track your solutions</p>
              </div>
              <span style={{ color:'#9ca3af', marginLeft:'auto' }}>→</span>
            </Link>
          ) : (
            <Link to="/post-problem" className="glass-card flex items-center gap-4" style={{ padding:'18px 22px', textDecoration:'none' }}>
              <span style={{ fontSize:26 }}>➕</span>
              <div>
                <p className="font-bold" style={{ color:'#1e1e3f', fontSize:14 }}>Post a Challenge</p>
                <p style={{ color:'#6b7280', fontSize:12 }}>Find talented solvers</p>
              </div>
              <span style={{ color:'#9ca3af', marginLeft:'auto' }}>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;