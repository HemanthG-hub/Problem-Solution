import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DOMAINS = ['Web Development', 'AI/ML', 'Mobile Development', 'DevOps', 'Data Science', 'System Design'];
const domainIcons = { 'Web Development':'🌐','AI/ML':'🤖','Mobile Development':'📱','DevOps':'⚙️','Data Science':'📊','System Design':'🏗️' };

const PostProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', domain: '', difficulty: 'easy', creditsReward: '', deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/problems', formData);
      setSuccess(true);
      setTimeout(() => navigate('/explore'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post problem');
    }
    setLoading(false);
  };

  const difficultyOptions = [
    { value: 'easy',   label: 'Easy',   color: '#43e97b', icon: '🟢', desc: 'Beginner-friendly' },
    { value: 'medium', label: 'Medium', color: '#ffd54f', icon: '🟡', desc: 'Intermediate level' },
    { value: 'hard',   label: 'Hard',   color: '#ff6584', icon: '🔴', desc: 'Expert required' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -150, left: -200, opacity: 0.3 }} />
      <div className="orb orb-pink"   style={{ width: 400, height: 400, bottom: 0, right: -100, opacity: 0.2 }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>

        {/* Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(26px, 5vw, 42px)', color: '#e8e8f0' }}>
            Post a <span className="gradient-text">Challenge</span>
          </h1>
          <p style={{ color: '#8888a8', fontSize: 15 }}>
            Create a real-world problem and discover talented students to solve it
          </p>
        </div>

        {success ? (
          <div className="glass-card animate-scale-in" style={{ padding: 48, textAlign: 'center' }}>
            <div className="text-5xl mb-4 animate-bounce-soft">🎉</div>
            <h2 className="font-bold mb-2" style={{ fontSize: 24, color: '#e8e8f0' }}>Challenge Posted!</h2>
            <p style={{ color: '#8888a8' }}>Redirecting to Explore...</p>
          </div>
        ) : (
          <div className="glass-card animate-fade-in delay-100" style={{ padding: 36 }}>
            {error && <div className="alert-error mb-5">⚠ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Title */}
              <div>
                <label className="form-label">Challenge Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Build a Scalable REST API with rate limiting"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Problem Description *</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: 140, resize: 'vertical' }}
                  placeholder="Describe the problem in detail — context, requirements, expected deliverables, constraints..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Domain Selector */}
              <div>
                <label className="form-label">Domain *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DOMAINS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, domain: d })}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all duration-300"
                      style={{
                        background: formData.domain === d ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                        border: formData.domain === d ? '1px solid rgba(108,99,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                        cursor: 'pointer',
                        transform: formData.domain === d ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{domainIcons[d]}</span>
                      <span style={{ color: formData.domain === d ? '#a89dff' : '#8888a8', fontSize: 13, fontWeight: 500 }}>{d}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="form-label">Difficulty *</label>
                <div className="grid grid-cols-3 gap-3">
                  {difficultyOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: opt.value })}
                      className="p-4 rounded-xl text-center transition-all duration-300"
                      style={{
                        background: formData.difficulty === opt.value ? `${opt.color}18` : 'rgba(255,255,255,0.03)',
                        border: formData.difficulty === opt.value ? `1px solid ${opt.color}50` : '1px solid rgba(255,255,255,0.07)',
                        cursor: 'pointer',
                        transform: formData.difficulty === opt.value ? 'scale(1.04)' : 'scale(1)',
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{opt.icon}</div>
                      <div style={{ color: formData.difficulty === opt.value ? opt.color : '#8888a8', fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                      <div style={{ color: '#8888a8', fontSize: 11, marginTop: 2 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credits + Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Credits Reward *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#43e97b', fontSize: 16 }}>⭐</span>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: 44 }}
                      placeholder="e.g. 500"
                      value={formData.creditsReward}
                      onChange={(e) => setFormData({ ...formData, creditsReward: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Submission Deadline *</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 16,
                  borderRadius: 14,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Posting...
                  </span>
                ) : '📝 Post Challenge'}
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PostProblem;