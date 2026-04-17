import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold gradient-text">ProbSol</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/explore" 
                  className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                >
                  Explore
                </Link>
                {user.role === 'student' ? (
                  <Link 
                    to="/my-submissions" 
                    className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                  >
                    My Submissions
                  </Link>
                ) : (
                  <Link 
                    to="/post-problem" 
                    className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                  >
                    Post Problem
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full">
                  <span className="text-green-600 font-bold text-lg">{user.credits}</span>
                  <span className="text-gray-600 text-sm">Credits</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;