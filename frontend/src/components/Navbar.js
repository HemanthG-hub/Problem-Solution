import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108,99,255,0.1)',
        boxShadow: scrolled ? '0 4px 24px rgba(108,99,255,0.08)' : '0 1px 0 rgba(108,99,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center animate-glow"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #ff6584)' }}
            >
              <span className="text-white font-black text-lg" style={{ fontFamily: 'Space Grotesk' }}>P</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block" style={{ fontFamily: 'Space Grotesk' }}>
              ProbSol
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/explore" className="nav-link">Explore</Link>
                {user.role === 'student'
                  ? <Link to="/my-submissions" className="nav-link">My Submissions</Link>
                  : <Link to="/post-problem" className="nav-link">Post Problem</Link>
                }
                <Link to="/profile" className="nav-link">Profile</Link>

                {/* Credits Pill */}
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <span style={{ fontSize: 15 }}>⭐</span>
                  <span className="font-bold text-sm gradient-text-green">{user.credits}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>credits</span>
                </div>

                {/* Avatar */}
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white transition-all duration-300 hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                <button onClick={handleLogout} className="btn-danger" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 10 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '9px 22px', fontSize: 14, textDecoration: 'none', borderRadius: 10 }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5"
            style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.12)', cursor: 'pointer' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {[0,1,2].map(i => (
              <span key={i} className="w-4 h-0.5 rounded transition-all duration-300"
                style={{ background: '#6c63ff',
                  transform: i === 0 && mobileOpen ? 'rotate(45deg) translate(3px,3px)'
                            : i === 2 && mobileOpen ? 'rotate(-45deg) translate(3px,-3px)' : 'none',
                  opacity: i === 1 && mobileOpen ? 0 : 1 }} />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: mobileOpen ? '400px' : '0' }}>
          <div className="py-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(108,99,255,0.08)' }}>
            {user ? (
              <>
                <Link to="/explore" className="px-4 py-3 rounded-xl nav-link block" style={{ fontSize: 15 }}>Explore</Link>
                {user.role === 'student'
                  ? <Link to="/my-submissions" className="px-4 py-3 nav-link block" style={{ fontSize: 15 }}>My Submissions</Link>
                  : <Link to="/post-problem" className="px-4 py-3 nav-link block" style={{ fontSize: 15 }}>Post Problem</Link>
                }
                <Link to="/profile" className="px-4 py-3 nav-link block" style={{ fontSize: 15 }}>Profile</Link>
                <div className="flex items-center gap-2 px-4 py-3">
                  <span>⭐</span>
                  <span className="gradient-text-green font-bold">{user.credits} credits</span>
                </div>
                <button onClick={handleLogout} className="btn-danger mx-4 mt-1" style={{ padding: '10px', borderRadius: 12 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-3 nav-link block" style={{ fontSize: 15 }}>Login</Link>
                <Link to="/register" className="btn-primary mx-4 mt-1 block text-center" style={{ textDecoration: 'none', padding: '12px', borderRadius: 12 }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;