import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, User, BookOpen, Mail, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import BlogPage from '../pages/BlogPage';
import ContactPage from '../pages/ContactPage';
import LoginForm from './Auth/LoginForm';
import NewBlogPost from '../pages/NewBlogPost';
import ProtectedRoute from './Auth/ProtectedRoute';
import BlogViewPage from '../pages/BlogViewPage';

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">LilyH Living</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <User className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link to="/blog" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/blog/new" 
            element={
              <ProtectedRoute>
                <NewBlogPost />
              </ProtectedRoute>
            } 
          />
          <Route path="/blog/:id" element={<BlogViewPage />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LuxuryHomes</h3>
              <p className="text-gray-300">Your trusted partner in finding the perfect home.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">123 Real Estate Ave</p>
              <p className="text-gray-300">Los Angeles, CA 90001</p>
              <p className="text-gray-300">Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; 2024 LuxuryHomes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppContent; 