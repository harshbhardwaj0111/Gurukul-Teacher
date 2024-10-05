import React from 'react';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl flex justify-around md:hidden ">
      <Link to="/" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
      <i class="fa-solid fa-house text-2xl"></i>
        <span className="block text-xs mt-1">Home</span>
      </Link>
      <Link to="/profile-management" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
        <i className="fas fa-user text-2xl"></i>
        <span className="block text-xs mt-1">Profile</span>
      </Link>
      <Link to="/courses-management" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
        <i className="fas fa-chalkboard-teacher text-2xl"></i>
        <span className="block text-xs mt-1">Courses</span>
      </Link>
      <Link to="/examination-management" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
        <i className="fas fa-cogs text-2xl"></i>
        <span className="block text-xs mt-1">Exam</span>
      </Link>
      <Link to="/salary-management" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
        <i className="fas fa-money-bill-wave text-2xl"></i>
        <span className="block text-xs mt-1">Salary</span>
      </Link>
      <Link to="/notification-management" className="flex-1 text-center py-3 transition-all duration-300 hover:bg-blue-700 rounded-lg mx-1">
        <i className="fas fa-money-bill-wave text-2xl"></i>
        <span className="block text-xs mt-1">Notification</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
