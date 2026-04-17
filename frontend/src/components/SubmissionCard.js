const SubmissionCard = ({ submission, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{submission.title}</h3>
          <p className="text-gray-600">{submission.problemId?.title || 'Problem'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
          {submission.status}
        </span>
      </div>
      <p className="text-gray-700 mb-4">{submission.description}</p>
      {submission.githubLink && (
        <p className="mb-2">
          <strong>GitHub:</strong> <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{submission.githubLink}</a>
        </p>
      )}
      {submission.fileUrl && (
        <p className="mb-2">
          <strong>File:</strong> <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{submission.fileUrl}</a>
        </p>
      )}
      <p className="text-sm text-gray-500">
        Submitted on: {new Date(submission.createdAt).toLocaleDateString()}
      </p>
      {onReview && submission.status === 'pending' && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onReview(submission._id, 'accepted')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => onReview(submission._id, 'rejected')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;