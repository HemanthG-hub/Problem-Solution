import { Link } from 'react-router-dom';

const domainIcons = {
  'Web Development':    { icon: '🌐', color: '#6c63ff', bg: 'rgba(108,99,255,0.08)' },
  'AI/ML':             { icon: '🤖', color: '#e11d48', bg: 'rgba(225,29,72,0.07)'  },
  'Mobile Development':{ icon: '📱', color: '#059669', bg: 'rgba(5,150,105,0.08)'  },
  'DevOps':            { icon: '⚙️', color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
  'Data Science':      { icon: '📊', color: '#2563eb', bg: 'rgba(37,99,235,0.08)'  },
  'System Design':     { icon: '🏗️', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
};

const difficultyConfig = {
  easy:   { label: 'Easy',   tagClass: 'tag-green',  dot: '#10b981' },
  medium: { label: 'Medium', tagClass: 'tag-yellow', dot: '#f59e0b' },
  hard:   { label: 'Hard',   tagClass: 'tag-red',    dot: '#ef4444' },
};

const ProblemCard = ({ problem, index = 0 }) => {
  const domain = domainIcons[problem.domain] || { icon: '💡', color: '#6c63ff', bg: 'rgba(108,99,255,0.08)' };
  const diff   = difficultyConfig[problem.difficulty] || difficultyConfig.easy;
  const daysLeft  = Math.ceil((new Date(problem.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const isUrgent  = !isExpired && daysLeft <= 3;

  return (
    <div
      className="glass-card animate-fade-in group"
      style={{ animationDelay: `${index * 70}ms`, position: 'relative', overflow: 'hidden' }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${domain.color}, transparent)`, borderRadius: '20px 20px 0 0' }} />

      {/* Domain header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: domain.bg }}>
          <span style={{ fontSize: 18 }}>{domain.icon}</span>
          <span style={{ color: domain.color, fontSize: 12, fontWeight: 600 }}>{problem.domain}</span>
        </div>
        <span className={`tag ${diff.tagClass}`}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: diff.dot, display: 'inline-block' }} />
          {diff.label}
        </span>
      </div>

      <div className="px-5 pb-5">
        <h3 className="font-bold mb-2 transition-colors duration-300" style={{ fontSize: 16, lineHeight: 1.45, color: '#1e1e3f' }}>
          {problem.title}
        </h3>
        <p className="mb-4" style={{
          color: '#6b7280', fontSize: 13, lineHeight: 1.7,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {problem.description}
        </p>

        {/* Posted by */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
            {problem.createdBy?.name?.charAt(0) || '?'}
          </div>
          <span style={{ color: '#9ca3af', fontSize: 12 }}>
            {problem.createdBy?.name?.split(' ')[0] || 'Anonymous'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl"
          style={{ background: '#f8f9ff', border: '1px solid rgba(108,99,255,0.08)' }}>
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>Reward</p>
            <p className="font-black gradient-text-green" style={{ fontSize: 20 }}>
              {problem.creditsReward}
              <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 400, marginLeft: 2 }}>pts</span>
            </p>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(108,99,255,0.1)' }} />
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>Deadline</p>
            <p className="font-black" style={{
              fontSize: 20,
              color: isExpired ? '#ef4444' : isUrgent ? '#f59e0b' : '#059669',
            }}>
              {isExpired ? 'Closed' : `${daysLeft}d`}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/problem/${problem._id}`}
          className="block text-center font-semibold text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            borderRadius: 12, padding: '11px 0',
            textDecoration: 'none', fontSize: 14,
            boxShadow: '0 4px 14px rgba(108,99,255,0.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(108,99,255,0.38)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(108,99,255,0.25)'; }}
        >
          View Challenge →
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;