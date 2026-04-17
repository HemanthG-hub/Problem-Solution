import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    difficulty: 'easy',
    creditsReward: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/problems', formData);
      alert('Problem posted successfully!');
      navigate('/explore');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post problem');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post a Problem</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            rows="6"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Domain</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Difficulty</label>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Credits Reward</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.creditsReward}
            onChange={(e) => setFormData({ ...formData, creditsReward: e.target.value })}
            min="0"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Deadline</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Problem'}
        </button>
      </form>
    </div>
  );
};

export default PostProblem;