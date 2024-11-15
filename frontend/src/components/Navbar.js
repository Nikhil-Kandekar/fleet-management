import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <Link to="/vehicle" className="hover:text-blue-300">Vehicles</Link>
          <Link to="/notifications" className="hover:text-blue-300">Notifications</Link>
          <Link to="/video" className="hover:text-blue-300">Dashcam</Link>
          <Link to="/analytics" className="hover:text-blue-300">Analytics</Link>
        </div>

        {/* User Avatar */}
        <div className="hidden md:flex items-center space-x-4">
          <UserCircleIcon className="h-8 w-8 hover:text-blue-300 cursor-pointer" />
          <Link to="/login" className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100">
            Login
          </Link>
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
            <Link to="/" className="block hover:bg-blue-500 p-2 rounded-md">Dashboard</Link>
            <Link to="/vehicle" className="block hover:bg-blue-500 p-2 rounded-md">Vehicles</Link>
            <Link to="/notifications" className="block hover:bg-blue-500 p-2 rounded-md">Notifications</Link>
            <Link to="/video" className="block hover:bg-blue-500 p-2 rounded-md">Dashcam</Link>
            <Link to="/analytics" className="block hover:bg-blue-500 p-2 rounded-md">Analytics</Link>
            <Link to="/login" className="block hover:bg-blue-500 p-2 rounded-md">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
