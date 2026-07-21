import { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import Loader from '../components/Loader';
import api from '../services/api';

const FILTERS = ['all', 'easy', 'medium', 'hard'];
const DOMAINS = ['All Domains', 'Web Development', 'AI/ML', 'Mobile Development', 'DevOps', 'Data Science', 'System Design'];

const Explore = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try { const res = await api.get('/problems'); setProblems(res.data); }
      catch { setError('Failed to load problems'); }
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const filtered = problems.filter(p => {
    const matchDiff   = diffFilter === 'all' || p.difficulty === diffFilter;
    const matchDomain = domainFilter === 'All Domains' || p.domain === domainFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchDomain && matchSearch;
  });

  const totalCredits = problems.reduce((s, p) => s + p.creditsReward, 0);
  const activeCount  = problems.filter(p => new Date(p.deadline) > new Date()).length;

  if (loading) return <Loader text="Loading challenges..." />;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="orb orb-purple" style={{ width: 600, height: 600, top: -200, right: -200, opacity: 0.45 }} />
      <div className="orb orb-green"  style={{ width: 400, height: 400, bottom: 100, left: -150, opacity: 0.35 }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(28px,5vw,48px)', color: '#1e1e3f' }}>
            Explore <span className="gradient-text">Challenges</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Real-world problems from top industries — pick one and start earning</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in delay-100" style={{ maxWidth: 560 }}>
          {[
            { label: 'Total Problems', value: problems.length, color: '#6c63ff' },
            { label: 'Credits Pool',   value: totalCredits,    color: '#10b981' },
            { label: 'Active Now',     value: activeCount,     color: '#ff6584' },
          ].map((s, i) => (
            <div key={i} className="text-center px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(108,99,255,0.1)', boxShadow: '0 2px 12px rgba(108,99,255,0.06)' }}>
              <p className="font-black" style={{ fontSize: 22, color: s.color }}>{s.value}</p>
              <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="animate-fade-in delay-200 mb-6">
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <span style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:17 }}>🔍</span>
            <input type="text" className="input-field" style={{ paddingLeft: 46, fontSize: 15 }}
              placeholder="Search challenges..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Difficulty pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setDiffFilter(f)}
                className="px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  background: diffFilter === f ? 'linear-gradient(135deg,#6c63ff,#a855f7)' : 'white',
                  color: diffFilter === f ? 'white' : '#6b7280',
                  border: diffFilter === f ? 'none' : '1.5px solid rgba(108,99,255,0.15)',
                  cursor: 'pointer',
                  boxShadow: diffFilter === f ? '0 4px 14px rgba(108,99,255,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transform: diffFilter === f ? 'scale(1.05)' : 'scale(1)',
                }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Domain pills */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomainFilter(d)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300"
                style={{
                  background: domainFilter === d ? 'rgba(16,185,129,0.08)' : 'white',
                  color: domainFilter === d ? '#059669' : '#6b7280',
                  border: domainFilter === d ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(108,99,255,0.1)',
                  cursor: 'pointer',
                }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert-error mb-5">⚠ {error}</div>}

        <p className="mb-5 animate-fade-in" style={{ color: '#9ca3af', fontSize: 13 }}>
          Showing <span style={{ color: '#6c63ff', fontWeight: 600 }}>{filtered.length}</span> of {problems.length} challenges
        </p>

        <div className="card-grid-3 mb-10">
          {filtered.map((problem, i) => <ProblemCard key={problem._id} problem={problem} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state animate-fade-in">
            <span className="empty-state-icon">🔭</span>
            <h3 className="font-bold mb-2" style={{ fontSize: 20, color: '#1e1e3f' }}>No challenges found</h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your filters or search terms</p>
            <button onClick={() => { setDiffFilter('all'); setDomainFilter('All Domains'); setSearch(''); }}
              className="btn-secondary mt-5" style={{ display:'inline-block' }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;