import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotificationManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="max-h-screen p-4">
      <div className="mx-auto">
        {isMobile ? (
          // Mobile layout
          <div className="max-h-screen">
            <div className="max-w-5xl mx-auto">
              <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-blue-900 text-center">Notification Management</h1>
              </header>
              <div className="grid grid-cols-1 gap-6">
                {/* Add Notification */}
                <Link to="/add-notification" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-bell text-blue-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Add Notification</h2>
                      <p className="text-gray-600 text-sm">Create a new notification for your class.</p>
                    </div>
                  </div>
                </Link>

                {/* View Notifications */}
                <Link to="/view-notification" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-eye text-green-500 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">View Notifications</h2>
                      <p className="text-gray-600 text-sm">See all notifications for your class.</p>
                    </div>
                  </div>
                </Link>

                {/* Student Achievements */}
                <Link to="/student-achievements" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-trophy text-yellow-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Student Achievements</h2>
                      <p className="text-gray-600 text-sm">View achievements of your students.</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout
          <div className="min-h-screen p-6">
            <div className="max-w-full mx-auto">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">Notification Management</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Add Notification */}
                <Link to="/add-notification">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-bell text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Add Notification</h2>
                    </div>
                    <p className="text-gray-700">Create a new notification for your class.</p>
                  </div>
                </Link>

                {/* View Notifications */}
                <Link to="/view-notification">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-eye text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">View Notifications</h2>
                    </div>
                    <p className="text-gray-700">See all notifications for your class.</p>
                  </div>
                </Link>

                {/* Student Achievements */}
                <Link to="/student-achievements">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-trophy text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Student Achievements</h2>
                    </div>
                    <p className="text-gray-700">View achievements of your students.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;
