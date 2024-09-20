import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Examination from './Pages/Examination';
import FeeManagement from './Pages/FeeManagement';
import NotificationManagement from './Pages/NotificationManagement';
import SalaryManagement from './Pages/SalaryManagement';
import ProfileManagement from './Pages/ProfileManagement';
import CoursesManagement from './Pages/CoursesManagement';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="layout-container flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="flex flex-1">
          {/* Sidebar - Hidden on small screens, visible on medium and larger screens */}
          <div className={`sidebar ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
            <Sidebar isOpen={sidebarOpen} />
          </div>

          {/* Main content */}
          <div className="main-content flex-1 p-4">
            <Routes>
              <Route path="/profile-management" element={<ProfileManagement />} />
              <Route path="/courses-management" element={<CoursesManagement />} />
              <Route path="/examination-management" element={<Examination />} />
              <Route path="/fee-management" element={<FeeManagement />} />
              <Route path="/notification-management" element={<NotificationManagement />} />
              <Route path="/salary-management" element={<SalaryManagement />} />
            </Routes>
          </div>
        </div>

        {/* Footer - Hidden on small screens */}
        <div className="footer hidden md:block">
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default Layout;
