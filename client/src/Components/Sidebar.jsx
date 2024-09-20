import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`bg-blue-800 text-white w-48 min-h-full p-4 shadow-lg fixed top-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <ul className="space-y-6 flex-grow">
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-tachometer-alt"></i>
            <Link to='/'>Dashboard</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-user"></i>
            <Link to='/profile-management'>Profile</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-chalkboard-teacher"></i>
            <Link to='/courses-management'>Courses</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-file-alt"></i>
            <Link to='/examination-management'>Examination</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-dollar-sign"></i>
            <Link to='/salary-management'>Salary</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-money-bill-wave"></i>
            <Link to='/fee-management'>Fees</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-bell"></i>
            <Link to='/notification-management'>Notifications</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;