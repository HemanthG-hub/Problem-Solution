import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const getImageForDomain = (domain) => {
  const domainMap = {
    'Web Development': '/images/web-dev.svg',
    'AI/ML': '/images/ai-ml.svg',
    'Mobile Development': '/images/mobile.svg',
    'DevOps': '/images/devops.svg',
    'Data Science': '/images/data-science.svg',
    'System Design': '/images/system-design.svg',
  };
  return domainMap[domain] || '/images/web-dev.svg';
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageUrl = problem ? getImageForDomain(problem.domain) : '';
  const daysLeft = problem ? Math.ceil((new Date(problem.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div></div>;
  if (!problem) return <div className="text-center text-red-500 py-12">Problem not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header with Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-96 overflow-hidden bg-gray-200 relative">
            <img 
              src={imageUrl} 
              alt={problem.domain}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-8 w-full">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty.toUpperCase()} DIFFICULTY
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">{problem.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Credits Reward</p>
                <p className="text-3xl font-bold text-green-600">{problem.creditsReward}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Domain</p>
                <p className="text-2xl font-bold text-blue-600">{problem.domain}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Days Remaining</p>
                <p className={`text-3xl font-bold ${daysLeft > 7 ? 'text-purple-600' : 'text-red-600'}`}>
                  {daysLeft}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium">Deadline</p>
                <p className="text-lg font-bold text-orange-600">{new Date(problem.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About This Problem</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{problem.description}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Posted By</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{problem.createdBy?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{problem.createdBy?.name}</p>
                  <p className="text-gray-600">{problem.createdBy?.email}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {user && user.role === 'student' && (
                <Link
                  to={`/submit/${id}`}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg hover:shadow-lg transition duration-300 font-bold text-center text-lg hover-lift"
                >
                  Submit Solution
                </Link>
              )}
              {user && user.role === 'industry' && problem.createdBy._id === user.id && (
                <Link
                  to={`/review/${id}`}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg hover:shadow-lg transition duration-300 font-bold text-center text-lg hover-lift"
                >
                  Review Submissions
                </Link>
              )}
              <Link
                to="/explore"
                className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 font-bold"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;