import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Invalid credentials.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -200, left: -200, opacity: 0.7 }} />
      <div className="orb orb-pink"   style={{ width: 400, height: 400, bottom: -150, right: -150, opacity: 0.6 }} />

      <div className="w-full animate-scale-in" style={{ maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: 40 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-glow"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
              <span className="text-white font-black text-3xl" style={{ fontFamily: 'Space Grotesk' }}>P</span>
            </div>
            <h1 className="font-black mb-1" style={{ fontSize: 26, color: '#1e1e3f' }}>Welcome Back</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Sign in to your ProbSol account</p>
          </div>

          {error && <div className="alert-error animate-fade-in-fast mb-5">⚠ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="input-field" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="input-field" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" required style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 17 }}>
                  {showPass ? '👁' : '🔒'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.35)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite' }} />
                Signing in...
              </span> : 'Sign In →'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.12)' }}>
            <p className="text-center font-semibold mb-3" style={{ color: '#6c63ff', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Demo Credentials</p>
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              <div className="flex items-center justify-between">
                <span style={{ color:'#6b7280',fontSize:12 }}>Student:</span>
                <code style={{ background:'rgba(108,99,255,0.07)',color:'#1e1e3f',padding:'2px 8px',borderRadius:6,fontSize:12 }}>alice@example.com</code>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color:'#6b7280',fontSize:12 }}>Password:</span>
                <code style={{ background:'rgba(108,99,255,0.07)',color:'#1e1e3f',padding:'2px 8px',borderRadius:6,fontSize:12 }}>password123</code>
              </div>
            </div>
          </div>

          <p className="text-center" style={{ color: '#6b7280', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Sign up free →</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;