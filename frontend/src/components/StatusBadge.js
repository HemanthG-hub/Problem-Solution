const statusConfig = {
  pending:  { label: 'Pending',  tagClass: 'tag-yellow', icon: '⏳' },
  accepted: { label: 'Accepted', tagClass: 'tag-green',  icon: '✓' },
  rejected: { label: 'Rejected', tagClass: 'tag-red',    icon: '✗' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, tagClass: 'tag-blue', icon: '•' };
  return (
    <span className={`tag ${config.tagClass}`} style={{ fontWeight: 600 }}>
      <span style={{ fontSize: 11 }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;