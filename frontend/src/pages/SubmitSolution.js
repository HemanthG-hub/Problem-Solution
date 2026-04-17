import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmitSolution = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', githubLink: '', fileUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/submissions', { ...formData, problemId });
      alert('Solution submitted successfully!');
      navigate('/my-submissions');
    } catch (error) {
      alert(error.response?.data?.message || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit Solution</h1>
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
          <label className="block text-gray-700 mb-2">GitHub Link (optional)</label>
          <input
            type="url"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.githubLink}
            onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">File URL (optional)</label>
          <input
            type="url"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Solution'}
        </button>
      </form>
    </div>
  );
};

export default SubmitSolution;