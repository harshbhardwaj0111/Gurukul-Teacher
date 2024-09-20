import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfileManagement = () => {
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
                <h1 className="text-3xl font-extrabold text-blue-900 text-center">Profile</h1>
              </header>
              <div className="grid grid-cols-1 gap-6">
                {/* View Profile */}
                <Link to="/view-profile" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-user-circle text-blue-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">View Profile</h2>
                      <p className="text-gray-600 text-sm">View your personal information.</p>
                    </div>
                  </div>
                </Link>

                {/* Attendance */}
                <Link to="/view-attendance" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-clipboard-check text-green-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">View Attendance</h2>
                      <p className="text-gray-600 text-sm">Check your attendance records.</p>
                    </div>
                  </div>
                </Link>

                {/* Schedule */}
                <Link to="/my-schedule" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-calendar-alt text-purple-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">My Class Schedule</h2>
                      <p className="text-gray-600 text-sm">View your class schedule.</p>
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
                <h1 className="text-4xl font-bold text-black">Profile</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* View Profile */}
                <Link to="/view-profile">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-user-circle text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">View Profile</h2>
                    </div>
                    <p className="text-gray-700">View your personal information and details.</p>
                  </div>
                </Link>

                {/* Attendance */}
                <Link to="/view-attendance">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-clipboard-check text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">View Attendance</h2>
                    </div>
                    <p className="text-gray-700">Check your attendance records.</p>
                  </div>
                </Link>

                {/* Schedule */}
                <Link to="/my-schedule">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-calendar-alt text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">My Class Schedule</h2>
                    </div>
                    <p className="text-gray-700">View your class timetable for the week.</p>
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

export default ProfileManagement;
