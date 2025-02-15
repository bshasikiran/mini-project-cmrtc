import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { username, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-900">
              Grief Support
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-blue-600">About</a>
            <a href="/resources" className="text-gray-600 hover:text-blue-600">Resources</a>
            <a href="/community" className="text-gray-600 hover:text-blue-600">Community</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!username ? (
              <>
                <button className="text-gray-600 hover:text-blue-600">
                  <Link to="/login">Login</Link>
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  <Link to="/signup">Get Started</Link>
                </button>
              </>
            ) : (
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
