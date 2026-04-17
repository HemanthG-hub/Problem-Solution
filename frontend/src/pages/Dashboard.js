import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ problems: 0, submissions: 0 });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const [problemsRes, submissionsRes] = await Promise.all([
            api.get('/problems'),
            user.role === 'student' ? api.get('/submissions/my') : api.get('/problems')
          ]);
          setStats({
            problems: problemsRes.data.length,
            submissions: user.role === 'student' ? submissionsRes.data.length : submissionsRes.data.filter(p => p.createdBy._id === user.id).length
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-4">Welcome to ProbSol</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl">
            Connect with real-world problems. Showcase your skills. Earn credits. Build your portfolio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:shadow-xl transition duration-300 font-bold text-lg text-center hover-lift"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg hover:shadow-xl transition duration-300 font-bold text-lg text-center hover-lift"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-600">Here's your latest activity and stats</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Credits Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover-lift animate-slide-in-left animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Your Credits</p>
                <p className="text-4xl font-bold gradient-text">{user.credits}</p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
              {user.role === 'student' ? 'Earn more by solving problems' : 'Award credits to students'}
            </p>
          </div>

          {/* Problems Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover-lift animate-slide-in-left delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Available Problems</p>
                <p className="text-4xl font-bold text-blue-600">{stats.problems}</p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
              Problems waiting to be solved
            </p>
          </div>

          {/* Submissions Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover-lift animate-slide-in-right delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {user.role === 'student' ? 'Your Submissions' : 'Your Problems'}
                </p>
                <p className="text-4xl font-bold text-purple-600">{stats.submissions}</p>
              </div>
              <div className="text-5xl">{user.role === 'student' ? '📝' : '📌'}</div>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
              {user.role === 'student' ? 'Track your progress' : 'Manage your postings'}
            </p>
          </div>

          {/* Rank Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover-lift animate-slide-in-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
                <p className="text-2xl font-bold text-green-600 capitalize">{user.role}</p>
              </div>
              <div className="text-5xl">{user.role === 'student' ? '🎓' : '🏢'}</div>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
              {user.role === 'student' ? 'Keep learning!' : 'Find great talent'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/explore"
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover-lift animate-fade-in"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Explore Problems</h3>
            <p className="text-blue-100">Browse and solve real-world challenges posted by industries</p>
          </Link>

          {user.role === 'student' ? (
            <Link
              to="/my-submissions"
              className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover-lift animate-fade-in"
            >
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-2xl font-bold mb-2">My Submissions</h3>
              <p className="text-green-100">Track your submissions and review feedback from industries</p>
            </Link>
          ) : (
            <Link
              to="/post-problem"
              className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover-lift animate-fade-in"
            >
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-2xl font-bold mb-2">Post a Problem</h3>
              <p className="text-purple-100">Create a new problem and find talented students to solve it</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;