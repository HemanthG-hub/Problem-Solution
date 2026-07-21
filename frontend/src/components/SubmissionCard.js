import StatusBadge from './StatusBadge';

const SubmissionCard = ({ submission, onReview, index = 0 }) => {
  const borderColor = { accepted:'rgba(16,185,129,0.2)', rejected:'rgba(239,68,68,0.2)', pending:'rgba(245,158,11,0.2)' };
  const barColor = {
    accepted: 'linear-gradient(90deg,#10b981,#059669)',
    rejected: 'linear-gradient(90deg,#ef4444,#dc2626)',
    pending:  'linear-gradient(90deg,#f59e0b,#d97706)',
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding:24, animationDelay:`${index*70}ms`, borderColor:borderColor[submission.status]||'rgba(108,99,255,0.1)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:barColor[submission.status]||'linear-gradient(90deg,#6c63ff,#a855f7)',borderRadius:'20px 20px 0 0' }} />

      <div className="flex items-start justify-between mb-3">
        <div style={{ flex:1,paddingRight:12 }}>
          <h3 className="font-bold mb-1" style={{ fontSize:16,color:'#1e1e3f' }}>{submission.title}</h3>
          <p style={{ color:'#9ca3af',fontSize:12 }}>📌 {submission.problemId?.title||'Challenge'}</p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      <p style={{ color:'#6b7280',fontSize:14,lineHeight:1.7,marginBottom:14,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden' }}>
        {submission.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {submission.githubLink && (
          <a href={submission.githubLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{ background:'rgba(108,99,255,0.07)',color:'#6c63ff',border:'1px solid rgba(108,99,255,0.18)',textDecoration:'none' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(108,99,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(108,99,255,0.07)'}>
            ⟨/⟩ View Code
          </a>
        )}
        {submission.fileUrl && (
          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{ background:'rgba(37,99,235,0.07)',color:'#2563eb',border:'1px solid rgba(37,99,235,0.15)',textDecoration:'none' }}>
            📎 Download File
          </a>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p style={{ color:'#9ca3af',fontSize:12 }}>
          📅 {new Date(submission.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
        </p>
        {onReview && submission.status === 'pending' && (
          <div className="flex gap-2">
            <button onClick={() => onReview(submission._id,'accepted')} className="btn-success" style={{ padding:'6px 14px',fontSize:12,borderRadius:8 }}>✓ Accept</button>
            <button onClick={() => onReview(submission._id,'rejected')} className="btn-danger"  style={{ padding:'6px 14px',fontSize:12,borderRadius:8 }}>✗ Reject</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;