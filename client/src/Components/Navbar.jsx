import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchSchoolData,
  getSchoolName,
  getLogo
} from '../Schoolinfo.js'; // Adjust the path to the actual file

const Navbar = ({ toggleSidebar }) => {
  const history = useNavigate();
  const [isSchoolDataLoaded, setIsSchoolDataLoaded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        await fetchSchoolData();
        setIsSchoolDataLoaded(true);
      } catch (error) {
        console.error('Error loading school data:', error);
      }
    };

    const checkNotifications = async () => {
      try {
        const response = await fetch('https://api.gurukulerp.in/api/notifications/getNotification');
        const data = await response.json();
        setNotificationCount(data.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    loadSchoolData();
    checkNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    history('/login');
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center text-white">
        {isSchoolDataLoaded && (
          <>
            <img
              src={getLogo()}
              alt="School Logo"
              className="h-12 w-12 rounded-full mr-4 border-2 border-white shadow-md"
            />
            <h1 className="text-2xl font-bold">{getSchoolName()}</h1>
          </>
        )}
      </div>
      <div className="flex items-center">
        <Link 
          to="/notifications-announcements" 
          className="relative text-white mr-6 md:block" 
          onClick={handleNotificationClick}
        >
          <i className="fas fa-bell text-2xl hover:text-yellow-300 transition-colors duration-300 relative">
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg">
              {notificationCount}
            </div>
          </i>
        </Link>
        <button
          className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200 font-semibold hidden md:block"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
        <button onClick={toggleSidebar} className="text-white ml-4 block md:hidden">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
