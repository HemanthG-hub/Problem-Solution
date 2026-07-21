import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import api from '../services/api';

const ReviewSubmissions = () => {
  const { problemId } = useParams();
  const [uniqueSubmissions, setUniqueSubmissions] = useState([]);
  const [duplicateSubmissions, setDuplicateSubmissions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [aiAnalysisMode, setAiAnalysisMode] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Try AI analysis first
        if (aiAnalysisMode) {
          const res = await api.get(`/submissions/ai/analysis/${problemId}`);
          setUniqueSubmissions(res.data.uniqueSubmissions);
          setDuplicateSubmissions(res.data.duplicateSubmissions);
          
          // Also fetch insights
          const insightsRes = await api.get(`/submissions/ai/insights/${problemId}`);
          setInsights(insightsRes.data);
        } else {
          // Fallback to regular submissions
          const res = await api.get(`/submissions/problem/${problemId}`);
          setUniqueSubmissions(res.data);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Failed to load submissions');
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [problemId, aiAnalysisMode]);

  const handleReview = async (submissionId, status) => {
    try {
      await api.patch(`/submissions/${submissionId}/review`, { status });
      
      // Update submissions
      const updatedUniqueSubmissions = uniqueSubmissions.map(sub =>
        sub._id === submissionId ? { ...sub, status } : sub
      );
      const updatedDuplicateSubmissions = duplicateSubmissions.map(sub =>
        sub._id === submissionId ? { ...sub, status } : sub
      );
      
      setUniqueSubmissions(updatedUniqueSubmissions);
      setDuplicateSubmissions(updatedDuplicateSubmissions);
      
      alert(`Submission ${status}!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold gradient-text">Review Submissions</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setAiAnalysisMode(!aiAnalysisMode)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              aiAnalysisMode
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            🤖 {aiAnalysisMode ? 'AI Mode' : 'Regular Mode'}
          </button>
          {showDuplicates && (
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-semibold">
              ⚠️ {duplicateSubmissions.length} Duplicate{duplicateSubmissions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {error && <div className="text-center text-red-500 mb-6">{error}</div>}

      {/* AI Insights Summary */}
      {aiAnalysisMode && insights && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📊 AI Analysis Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold text-blue-600">{insights.stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm">Unique Solutions</p>
              <p className="text-3xl font-bold text-green-600">{uniqueSubmissions.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm">Duplicates Found</p>
              <p className="text-3xl font-bold text-orange-600">{duplicateSubmissions.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm">Avg Quality Score</p>
              <p className="text-3xl font-bold text-purple-600">{insights.stats.averageQualityScore}/10</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-700 mb-2"><strong>Recommendation:</strong> {insights.insights.recommendation}</p>
            <p className="text-gray-600 text-sm"><strong>Best Practices:</strong> {insights.patterns.codeLinksIncluded} submissions have code links, {insights.patterns.filesAttached} have attachments, {insights.patterns.wellDocumented} are well documented.</p>
          </div>
        </div>
      )}

      {/* Unique Solutions (First-Come-First-Served) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✨ Unique Solutions (First Come, First Served)</h2>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
            {uniqueSubmissions.length}
          </span>
        </div>

        {uniqueSubmissions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {uniqueSubmissions.map((submission, index) => (
              <div
                key={submission._id}
                className="border-2 border-green-200 bg-green-50 rounded-xl p-6 hover:shadow-lg transition hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{submission.title}</h3>
                      <p className="text-gray-600 text-sm">by {submission.userId?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  {submission.qualityAnalysis && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        {submission.qualityAnalysis.qualityScore}/10
                      </p>
                      <p className="text-xs font-semibold text-purple-700">
                        {submission.qualityAnalysis.recommendation}
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{submission.description}</p>

                {/* Quality Indicators */}
                {submission.qualityAnalysis && (
                  <div className="mb-4 p-3 bg-white rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Quality Indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {submission.qualityAnalysis.indicators.hasCodeLink && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          🔗 Code Link
                        </span>
                      )}
                      {submission.qualityAnalysis.indicators.hasFileAttachment && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          📎 File Attached
                        </span>
                      )}
                      {submission.qualityAnalysis.indicators.hasDetailedDescription && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          📝 Detailed Desc
                        </span>
                      )}
                      {submission.qualityAnalysis.indicators.hasKeywords.tested && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          ✓ Tested
                        </span>
                      )}
                      {submission.qualityAnalysis.indicators.hasKeywords.documented && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          📖 Documented
                        </span>
                      )}
                      {submission.qualityAnalysis.indicators.hasKeywords.optimized && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                          ⚡ Optimized
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {submission.githubLink && (
                    <a
                      href={submission.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm font-semibold"
                    >
                      View Code
                    </a>
                  )}
                  {submission.fileUrl && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Download File
                    </a>
                  )}
                  <button
                    onClick={() => handleReview(submission._id, 'accepted')}
                    disabled={submission.status === 'accepted'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      submission.status === 'accepted'
                        ? 'bg-green-200 text-green-800 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleReview(submission._id, 'rejected')}
                    disabled={submission.status === 'rejected'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      submission.status === 'rejected'
                        ? 'bg-red-200 text-red-800 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    ✗ Reject
                  </button>
                </div>

                {submission.status && (
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Status: <span className="text-blue-600">{submission.status.toUpperCase()}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate Submissions */}
      {duplicateSubmissions.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowDuplicates(!showDuplicates)}
            className="w-full bg-orange-100 border-2 border-orange-300 text-orange-900 p-4 rounded-xl hover:bg-orange-200 transition font-semibold text-lg"
          >
            {showDuplicates ? '▼' : '▶'} Show Similar/Duplicate Solutions ({duplicateSubmissions.length})
          </button>

          {showDuplicates && (
            <div className="mt-4 space-y-4">
              {duplicateSubmissions.map((submission, index) => (
                <div
                  key={submission._id}
                  className="border-2 border-orange-200 bg-orange-50 rounded-xl p-6 opacity-75 hover:opacity-100 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-orange-900">{submission.title}</h3>
                      <p className="text-orange-700 text-sm">by {submission.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-orange-600 mt-1">⚠️ Similar to earlier submission - {submission.similarity}</p>
                    </div>
                    {submission.qualityAnalysis && (
                      <p className="text-lg font-bold text-orange-600">
                        {submission.qualityAnalysis.qualityScore}/10
                      </p>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{submission.description}</p>

                  <div className="flex gap-2">
                    {submission.githubLink && (
                      <a
                        href={submission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;