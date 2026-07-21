import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-green"  style={{ width: 500, height: 500, top: -200, right: -200, opacity: 0.6 }} />
      <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: -150, left: -150, opacity: 0.5 }} />

      <div className="w-full animate-scale-in" style={{ maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: 40 }}>
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              <span className="font-black text-3xl" style={{ color: 'white', fontFamily: 'Space Grotesk' }}>+</span>
            </div>
            <h1 className="font-black mb-1" style={{ fontSize: 26, color: '#1e1e3f' }}>Create Account</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Join thousands of problem-solvers today</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="form-label">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'student',  icon: '🎓', title: 'Solve Problems', sub: 'Earn credits & build portfolio' },
                { value: 'industry', icon: '🏢', title: 'Post Problems',  sub: 'Find talented students' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, role: opt.value })}
                  className="text-left p-4 rounded-xl transition-all duration-300"
                  style={{
                    background: formData.role === opt.value ? 'rgba(16,185,129,0.07)' : '#f8f9ff',
                    border: formData.role === opt.value ? '1.5px solid rgba(16,185,129,0.4)' : '1.5px solid rgba(108,99,255,0.1)',
                    cursor: 'pointer', transform: formData.role === opt.value ? 'scale(1.02)' : 'scale(1)',
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{opt.icon}</div>
                  <div style={{ color: '#1e1e3f', fontWeight: 600, fontSize: 13 }}>{opt.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="alert-error animate-fade-in-fast mb-4">⚠ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" className="input-field" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" required />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="input-field" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="input-field" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="At least 6 characters" minLength={6} required style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:17 }}>
                  {showPass ? '👁' : '🔒'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%',background:'linear-gradient(135deg,#10b981,#059669)',color:'white',border:'none',borderRadius:12,padding:'14px',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,transition:'all 0.3s',marginTop:4,boxShadow:'0 4px 16px rgba(16,185,129,0.3)',fontFamily:'Inter,sans-serif' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform='translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
              {loading ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.35)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite' }} />
                Creating account...
              </span> : 'Create Account →'}
            </button>
          </form>

          <div className="divider" style={{ margin: '22px 0' }} />
          <p className="text-center" style={{ color: '#6b7280', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;