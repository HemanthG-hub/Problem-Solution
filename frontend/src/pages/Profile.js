import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center py-12 text-gray-600">Please login to view your profile.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-16 mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white font-bold text-6xl">{user.name.charAt(0)}</span>
              </div>
            </div>

            {/* User Info */}
            <h1 className="text-4xl font-bold text-gray-800 mb-1">{user.name}</h1>
            <p className="text-lg text-gray-600 mb-8 capitalize">{user.role === 'student' ? '🎓 Student' : '🏢 Industry'}</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Credits</p>
                <p className="text-4xl font-bold text-green-600">{user.credits}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Account Type</p>
                <p className="text-2xl font-bold text-blue-600 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Email Address</label>
                  <p className="text-lg text-gray-800 mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Account Status</label>
                  <p className="text-lg text-gray-800 mt-1">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {user.role === 'student'
                  ? 'Welcome to your profile! Start solving problems to earn credits and showcase your skills.'
                  : 'Welcome to your profile! Post challenges and find talented students to work on your problems.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;