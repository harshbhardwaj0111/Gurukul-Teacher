import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Desktop Sidebar Component for Teacher
const DesktopTeacherSidebar = () => (
   <aside className={`bg-blue-800 text-white w-48 min-h-full p-4 shadow-lg fixed top-0 left-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <ul className="space-y-6 flex-grow">
          <li className="flex items-center space-x-2 hover:bg-gray-200 p-3 rounded bg-white text-black font-semibold shadow-lg">
            <i className="fas fa-tachometer-alt"></i>
            <Link to='/dashboard'>Dashboard</Link>
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

// Mobile Sidebar Component for Teacher
const MobileTeacherSidebar = ({ isOpen }) => (
  <aside className={`fixed top-0 left-0 min-h-full p-4 bg-blue-600 text-white w-64 border-r border-blue-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-md`}>
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Teacher Panel</h1>
      </div>

      <ul className="space-y-6 flex-grow">
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-tachometer-alt text-gray-300"></i>
          <Link to='/dashboard' className="text-lg font-medium text-white">Dashboard</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-user text-gray-300"></i>
          <Link to='/profile-management' className="text-lg font-medium text-white">Profile</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-chalkboard-teacher text-gray-300"></i>
          <Link to='/courses-management' className="text-lg font-medium text-white">Courses</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-file-alt text-gray-300"></i>
          <Link to='/examination-management' className="text-lg font-medium text-white">Examination</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-dollar-sign text-gray-300"></i>
          <Link to='/salary-management' className="text-lg font-medium text-white">Salary</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-money-bill-wave text-gray-300"></i>
          <Link to='/fee-management' className="text-lg font-medium text-white">Fees</Link>
        </li>
        <li className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-bell text-gray-300"></i>
          <Link to='/notification-management' className="text-lg font-medium text-white">Notifications</Link>
        </li>
      </ul>

      <ul>
        <li className="flex items-center space-x-4 p-3 rounded-lg border border-blue-600 bg-blue-900 hover:bg-blue-700 transition-colors duration-200">
          <i className="fas fa-sign-out-alt text-gray-300"></i>
          <button className="text-lg font-medium text-white">Logout</button>
        </li>
      </ul>
    </div>
  </aside>
);

// Responsive Sidebar for Teacher Panel
const Sidebar = ({ isOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileTeacherSidebar isOpen={isOpen} /> : <DesktopTeacherSidebar />;
};

export default Sidebar;
