import { Link } from 'react-router-dom';

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

const ProblemCard = ({ problem }) => {
  const imageUrl = getImageForDomain(problem.domain);
  const daysLeft = Math.ceil((new Date(problem.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-md hover-lift overflow-hidden animate-fade-in group">
      <div className="relative overflow-hidden h-48 bg-gray-200">
        <img 
          src={imageUrl} 
          alt={problem.domain}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {problem.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {problem.domain}
          </span>
          <span className="text-xs text-gray-500">Posted by {problem.createdBy?.name?.split(' ')[0]}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {problem.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Credits Reward</p>
            <p className="text-2xl font-bold text-green-600">{problem.creditsReward}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Days Left</p>
            <p className={`text-2xl font-bold ${daysLeft > 7 ? 'text-blue-600' : 'text-red-600'}`}>
              {daysLeft}
            </p>
          </div>
        </div>

        <Link
          to={`/problem/${problem._id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg transition duration-300 inline-block text-center font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;