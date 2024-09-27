import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/blog', label: 'Blog', icon: <BlogIcon /> },
  ];

  const authLinks = isAuthenticated
    ? [
        { label: 'Profile', onClick: () => navigate('/profile'), icon: <ProfileIcon /> },
        { label: 'Settings', onClick: () => navigate('/settings'), icon: <SettingsIcon /> },
        { label: 'Logout', onClick: handleLogout, icon: <LogoutIcon /> },
      ]
    : [
        { to: '/login', label: 'Login', icon: <LoginIcon /> },
        { to: '/register', label: 'Register', icon: <RegisterIcon /> },
      ];

  return (
    <nav className={`navbar ${theme === 'light' ? 'navbar-light' : 'navbar-dark'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-tech">Tech</span>
          <span className="navbar-brand-blog">Blog</span>
        </Link>

        <div className="navbar-content">
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <NavLink key={link.to} {...link} isActive={location.pathname === link.to} />
            ))}

            {isAuthenticated ? (
              <div className="navbar-dropdown" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="navbar-dropdown-button"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-label="Account"
                >
                  <ProfileIcon />
                </button>
                {isDropdownOpen && (
                  <div className="navbar-dropdown-menu fade-in">
                    {authLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={link.onClick}
                        className="navbar-dropdown-item"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              authLinks.map((link) => <NavLink key={link.to} {...link} />)
            )}

            <button
              onClick={toggleTheme}
              className="navbar-theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="navbar-mobile-toggle"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✖️' : '☰'}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="navbar-mobile-menu slide-down">
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          {navLinks.map((link) => (
            <MobileNavLink key={link.to} {...link} />
          ))}
          {isAuthenticated ? (
            authLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.onClick}
                className="navbar-mobile-link"
              >
                {link.icon}
                {link.label}
              </button>
            ))
          ) : (
            authLinks.map((link) => <MobileNavLink key={link.to} {...link} />)
          )}
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, icon, label, isActive }) => (
  <Link to={to} className={`navbar-link ${isActive ? 'active' : ''}`}>
    {icon}
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon, label }) => (
  <Link to={to} className="navbar-mobile-link">
    {icon}
    {label}
  </Link>
);

// Example Icon Components
const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
const BlogIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" /></svg>;
const ProfileIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z"/></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.936l1.837-1.155-1.114-1.926-2.031.775a7.178 7.178 0 00-.887-.514l-.451-2.09h-2.222l-.449 2.09c-.319.14-.619.307-.888.514l-2.032-.775-1.113 1.926 1.837 1.155a7.142 7.142 0 000 1.123l-1.837 1.155 1.113 1.926 2.032-.775c.27.207.57.374.888.514l.449 2.09h2.222l.451-2.09c.319-.14.618-.307.887-.514l2.032.775 1.114-1.926-1.837-1.155a7.142 7.142 0 000-1.123zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>;
const LogoutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5c0-1.103.897-2 2-2h8c1.103 0 2 .897 2 2v14c0 1.103-.897 2-2 2h-8c-1.103 0-2-.897-2-2v-4h2v4h8V5h-8v4h-2z"/><path d="M8.707 11.293l-1.414 1.414L13.586 19H1v2h12.586l-6.293 6.293 1.414 1.414L17.414 20l-8.707-8.707z"/></svg>;
const LoginIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21H5c-1.103 0-2-.897-2-2V5c0-1.103.897-2 2-2h4v2H5v14h4v2zm5-10V9h-5V7h5V4l5 4.5-5 4.5zm0 6v-3h5v2l-5 4.5V17z"/></svg>;
const RegisterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zM6 18v1c0 2 4 3 6 3s6-1 6-3v-1c0-2-4-3-6-3s-6 1-6 3z"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19l-6.35-6.35A7.91 7.91 0 0016 9a8 8 0 10-8 8 7.91 7.91 0 003.65-.65L19 21l2-2zM9 15a6 6 0 110-12 6 6 0 010 12z"/></svg>;

export default Navbar;
