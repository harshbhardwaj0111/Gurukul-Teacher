import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Examination = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="max-h-screen p-4">
      <div className="mx-auto">
        {isMobile ? (
          // Mobile layout (app-like)
          <div className="max-h-screen">
            <div className="max-w-5xl mx-auto">
              <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-blue-900 text-center">
                  Exam Management
                </h1>
              </header>
              <div className="grid grid-cols-1 gap-6">
                {/* Result */}
                <Link to="/submit-result" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-poll-h text-green-500 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Submit Result</h2>
                      <p className="text-gray-600 text-sm">Submit results according to your subject.</p>
                    </div>
                  </div>
                </Link>

                {/* Prepare Result */}
                <Link to="/prepare-result" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-cogs text-yellow-600 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Prepare Result</h2>
                      <p className="text-gray-600 text-sm">Prepare results for your class.</p>
                    </div>
                  </div>
                </Link>

                {/* Old Papers */}
                <Link to="/old-papers" className="block">
                  <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center">
                    <i className="fas fa-file-pdf text-purple-500 text-4xl mr-4"></i>
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Old Papers</h2>
                      <p className="text-gray-600 text-sm">Access old papers for your subject.</p>
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
                <h1 className="text-4xl font-bold text-black">Exam Management</h1>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Result */}
                <Link to="/submit-result">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-poll-h text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Submit Result</h2>
                    </div>
                    <p className="text-gray-700">Submit results according to your subject.</p>
                  </div>
                </Link>

                {/* Prepare Result */}
                <Link to="/prepare-result">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-cogs text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Prepare Result</h2>
                    </div>
                    <p className="text-gray-700">Prepare results for your class.</p>
                  </div>
                </Link>

                {/* Old Papers */}
                <Link to="/old-papers">
                  <div className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-file-pdf text-blue-800 text-3xl mr-3"></i>
                      <h2 className="text-2xl font-semibold text-black">Old Papers</h2>
                    </div>
                    <p className="text-gray-700">Access old papers for your subject.</p>
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

export default Examination;
