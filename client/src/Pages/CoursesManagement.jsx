import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
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
                <h1 className="text-3xl font-extrabold text-blue-900 text-center">Courses</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Test Schedule */}
                <Link to="/test-schedule" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-calendar-alt text-blue-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Test Schedule</h2>
                      <p className="text-gray-600 text-sm">View your upcoming test schedule.</p>
                    </div>
                  </div>
                </Link>

                {/* Course Materials */}
                <Link to="/course-materials" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-book-open text-blue-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Course Materials</h2>
                      <p className="text-gray-600 text-sm">Access your course materials and resources.</p>
                    </div>
                  </div>
                </Link>

                {/* Assignments */}
                <Link to="/assignments" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-tasks text-yellow-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-yellow-500">Assignments</h2>
                      <p className="text-gray-500 text-sm">View and submit your assignments.</p>
                    </div>
                  </div>
                </Link>

                {/* Homework */}
                <Link to="/homework" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-pencil-alt text-green-500 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-green-500">Homework</h2>
                      <p className="text-gray-600 text-sm">Check your homework for each subject.</p>
                    </div>
                  </div>
                </Link>

                {/* Student Attendance */}
                <Link to="/student-attendance" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-user-check text-purple-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-purple-500">Student Attendance</h2>
                      <p className="text-gray-600 text-sm">View your attendance records.</p>
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
                <h1 className="text-4xl font-bold text-black">Courses</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Test Schedule */}
                <Link to="/test-schedule">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-calendar-alt text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Test Schedule</h2>
                    </div>
                    <p className="text-gray-700">View your upcoming test schedule.</p>
                  </div>
                </Link>

                {/* Course Materials */}
                <Link to="/course-materials">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-book-open text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Course Materials</h2>
                    </div>
                    <p className="text-gray-700">Access your course materials and resources.</p>
                  </div>
                </Link>

                {/* Assignments */}
                <Link to="/assignments">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-tasks text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Assignments</h2>
                    </div>
                    <p className="text-gray-700">View and submit your assignments.</p>
                  </div>
                </Link>

                {/* Homework */}
                <Link to="/homework">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-pencil-alt text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Homework</h2>
                    </div>
                    <p className="text-gray-700">Check your homework for each subject.</p>
                  </div>
                </Link>

                {/* Student Attendance */}
                <Link to="/student-attendance">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-user-check text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Student Attendance</h2>
                    </div>
                    <p className="text-gray-700">View your attendance records.</p>
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

export default Courses;
