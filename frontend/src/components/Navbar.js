import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for logged-in status

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert("You have been logged out successfully!");
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="text-2xl font-bold">
          <Link to="/">Fleet Management</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/analytics" className="hover:text-blue-300">Analytics</Link>
          <Link to="/video" className="hover:text-blue-300">Dashcam</Link>
        </div>

        {/* User Avatar / Logout Button */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <UserCircleIcon className="h-8 w-8 hover:text-blue-300 cursor-pointer" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <XIcon className="h-6 w-6 text-white" />
            ) : (
              <MenuIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white">
          <div className="space-y-1 p-4">
            <Link to="/" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to="/analytics" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>Analytics</Link>
            <Link to="/video" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>Dashcam</Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left mt-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

