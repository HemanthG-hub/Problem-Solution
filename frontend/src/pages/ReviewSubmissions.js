import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubmissionCard from '../components/SubmissionCard';
import Loader from '../components/Loader';
import api from '../services/api';

const ReviewSubmissions = () => {
  const { problemId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/submissions/problem/${problemId}`);
        setSubmissions(res.data);
      } catch (error) {
        setError('Failed to load submissions');
        console.error('Error fetching submissions:', error);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [problemId]);

  const handleReview = async (submissionId, status) => {
    try {
      await api.patch(`/submissions/${submissionId}/review`, { status });
      setSubmissions(submissions.map(sub =>
        sub._id === submissionId ? { ...sub, status } : sub
      ));
      alert(`Submission ${status}!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Review Submissions</h1>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission._id}
            submission={submission}
            onReview={handleReview}
          />
        ))}
        {submissions.length === 0 && (
          <p className="text-center text-gray-500">No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissions;