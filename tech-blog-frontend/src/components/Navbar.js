import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const isAuthenticated = localStorage.getItem('access_token');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar bg-gradient-to-r from-purple-500 to-blue-600 p-4 text-white">
      <div className="navbar-container flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-white">Tech</span>
          <span className="text-yellow-400"> Blog</span>
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          <NavLink to="/" icon={<FaHome />} label="Home" />
          <NavLink to="/blog" icon={<FaBook />} label="Blog" />
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" icon={<FaSignInAlt />} label="Login" />
              <NavLink to="/register" icon={<FaUserPlus />} label="Register" />
            </>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu md:hidden flex flex-col items-center mt-4">
          <MobileNavLink to="/" icon={<FaHome />} label="Home" />
          <MobileNavLink to="/blog" icon={<FaBook />} label="Blog" />
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 mt-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          ) : (
            <>
              <MobileNavLink to="/login" icon={<FaSignInAlt />} label="Login" />
              <MobileNavLink to="/register" icon={<FaUserPlus />} label="Register" />
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 hover:text-yellow-300 transition"
  >
    {icon}
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 text-lg hover:text-yellow-300 transition"
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
