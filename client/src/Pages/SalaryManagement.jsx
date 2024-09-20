import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SalaryManagement = () => {
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
                <h1 className="text-3xl font-extrabold text-blue-900 text-center">Salary Management</h1>
              </header>
              <div className="grid grid-cols-1 gap-6">
                {/* View Salary */}
                <Link to="/view-salary" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-dollar-sign text-green-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">View Salary</h2>
                      <p className="text-gray-600 text-sm">Check your salary details.</p>
                    </div>
                  </div>
                </Link>

                {/* Ledger */}
                <Link to="/view-ledger" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-book text-purple-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Salary Ledger</h2>
                      <p className="text-gray-600 text-sm">View your salary transactions.</p>
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
                <h1 className="text-4xl font-bold text-black">Salary Management</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* View Salary */}
                <Link to="/view-salary">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-dollar-sign text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">View Salary</h2>
                    </div>
                    <p className="text-gray-700">Check your salary details for the month.</p>
                  </div>
                </Link>

                {/* Ledger */}
                <Link to="/view-ledger">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-book text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Salary Ledger</h2>
                    </div>
                    <p className="text-gray-700">View your salary transactions and history.</p>
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

export default SalaryManagement;
