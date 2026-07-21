import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmitSolution = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', githubLink: '', fileUrl: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/submissions', { ...formData, problemId });
      setSuccess(true);
      setTimeout(() => navigate('/my-submissions'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="orb orb-green"  style={{ width: 500, height: 500, top: -200, right: -150, opacity: 0.25 }} />
      <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: 0, left: -100, opacity: 0.2 }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>

        {/* Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(26px, 5vw, 42px)', color: '#e8e8f0' }}>
            Submit <span className="gradient-text-green">Solution</span>
          </h1>
          <p style={{ color: '#8888a8', fontSize: 15 }}>
            Share your approach, code, and solution details below
          </p>
        </div>

        {/* Tips card */}
        <div
          className="alert-info animate-fade-in delay-100 mb-6"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <p className="font-semibold mb-1" style={{ color: '#a89dff', fontSize: 13 }}>Pro Tips for Better Quality Score</p>
            <p style={{ color: '#8888a8', fontSize: 12, lineHeight: 1.6 }}>
              Include a GitHub link · Attach files · Write a detailed description (100+ characters) · Mention testing, documentation, and optimization.
            </p>
          </div>
        </div>

        {/* Success State */}
        {success && (
          <div className="glass-card animate-scale-in mb-6" style={{ padding: 32, textAlign: 'center' }}>
            <div className="text-5xl mb-4 animate-bounce-soft">✅</div>
            <h2 className="font-bold mb-2" style={{ fontSize: 22, color: '#e8e8f0' }}>Solution Submitted!</h2>
            <p style={{ color: '#8888a8' }}>Redirecting to your submissions...</p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <div className="glass-card animate-fade-in delay-200" style={{ padding: 32 }}>
            {error && <div className="alert-error mb-5">⚠ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Title */}
              <div>
                <label className="form-label">Solution Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. React + Node.js Full-Stack Implementation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Solution Description *</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: 160, resize: 'vertical' }}
                  placeholder="Describe your approach, architecture, how you tested it, performance optimizations, and any documentation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <div className="flex justify-between mt-2">
                  <p style={{ color: '#8888a8', fontSize: 11 }}>
                    Longer descriptions score higher (100+ chars recommended)
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: formData.description.length >= 100 ? '#43e97b' : '#8888a8'
                  }}>
                    {formData.description.length} chars
                  </p>
                </div>
              </div>

              {/* GitHub & File URL in 2 cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">GitHub Repository</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  />
                  <p style={{ color: '#8888a8', fontSize: 11, marginTop: 6 }}>Optional · +2 quality points</p>
                </div>
                <div>
                  <label className="form-label">File / Demo URL</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://drive.google.com/..."
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  />
                  <p style={{ color: '#8888a8', fontSize: 11, marginTop: 6 }}>Optional · +1 quality point</p>
                </div>
              </div>

              {/* Quality preview */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}
              >
                <p style={{ color: '#a89dff', fontSize: 12, fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Estimated Quality Score
                </p>
                {(() => {
                  let score = 0;
                  if (formData.githubLink)              score += 2;
                  if (formData.fileUrl)                  score += 1;
                  if (formData.description.length > 100) score += 2;
                  if (formData.description.toLowerCase().includes('test')) score += 1;
                  if (formData.description.toLowerCase().includes('optim')) score += 1;
                  return (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${(score / 10) * 100}%` }} />
                        </div>
                        <span className="font-black" style={{ color: score >= 6 ? '#43e97b' : score >= 3 ? '#ffd54f' : '#ff6584', fontSize: 16, minWidth: 48 }}>
                          {score}/10
                        </span>
                      </div>
                      <p style={{ color: '#8888a8', fontSize: 11, marginTop: 6 }}>
                        {score >= 6 ? '🌟 Excellent!' : score >= 3 ? '👍 Good — add more details' : '💪 Keep going — add links & detail'}
                      </p>
                    </div>
                  );
                })()}
              </div>

              <button
                type="submit"
                className="btn-success"
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
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0a0a0f', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Submitting...
                  </span>
                ) : '🚀 Submit Solution'}
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SubmitSolution;