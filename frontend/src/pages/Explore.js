import { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import Loader from '../components/Loader';
import api from '../services/api';

const Explore = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get('/problems');
        setProblems(res.data);
      } catch (error) {
        setError('Failed to load problems');
        console.error('Error fetching problems:', error);
      }
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const filteredProblems = filter === 'all' 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Explore <span className="gradient-text">Problems</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse real-world challenges from leading industries and start earning credits
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'easy', 'medium', 'hard'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setFilter(difficulty)}
                className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                  filter === difficulty
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProblems.map((problem, index) => (
            <div key={problem._id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
              <ProblemCard problem={problem} />
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No problems found</h3>
            <p className="text-gray-600 text-lg">
              {filter !== 'all' ? `No ${filter} problems available yet. Try another difficulty level.` : 'Come back soon for more challenges!'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold gradient-text">{problems.length}</p>
              <p className="text-gray-600 mt-2">Total Problems</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">{problems.reduce((sum, p) => sum + p.creditsReward, 0)}</p>
              <p className="text-gray-600 mt-2">Total Credits Available</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">{problems.filter(p => new Date(p.deadline) > new Date()).length}</p>
              <p className="text-gray-600 mt-2">Active Challenges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;