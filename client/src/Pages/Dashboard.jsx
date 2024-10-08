import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header for larger screens */}
        <header className="mb-8 hidden sm:block">
          <h1 className="text-4xl font-bold text-black">Teacher Dashboard</h1>
        </header>

        {/* Grid layout for dashboard options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 hidden sm:grid">
          {/* Notifications */}
          <Link to="/teacher-notifications">
            <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-4">
                <i className="fas fa-bell text-blue-800 text-3xl mr-3"></i>
                <h2 className="text-2xl font-semibold text-black">Notifications</h2>
              </div>
              <p className="text-gray-700">Stay updated with the latest announcements and important notices.</p>
            </div>
          </Link>

          {/* Class Reports */}
          <Link to="/class-reports">
            <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-4">
                <i className="fas fa-chart-bar text-green-800 text-3xl mr-3"></i>
                <h2 className="text-2xl font-semibold text-black">Class Reports</h2>
              </div>
              <p className="text-gray-700">View and manage class performance reports.</p>
            </div>
          </Link>
        </div>

        {/* Mobile View: Icons and text for smaller screens */}
        <div className="grid grid-cols-2 gap-6 sm:hidden">
          {/* Notifications */}
          <Link to="/teacher-notifications">
            <div className="bg-blue-100 shadow-md rounded-lg p-4 flex flex-col justify-center items-center hover:bg-blue-200 transition duration-200">
              <i className="fas fa-bell text-blue-800 text-4xl mb-2"></i>
              <span className="text-sm text-blue-800 font-semibold">Notifications</span>
            </div>
          </Link>

          {/* Class Reports */}
          <Link to="/class-reports">
            <div className="bg-green-100 shadow-md rounded-lg p-4 flex flex-col justify-center items-center hover:bg-green-200 transition duration-200">
              <i className="fas fa-chart-bar text-green-800 text-4xl mb-2"></i>
              <span className="text-sm text-green-800 font-semibold">Class Reports</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
