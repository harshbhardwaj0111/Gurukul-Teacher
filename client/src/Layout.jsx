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
import ViewProfile from './Profile/ViewProfile';
import Assignments from './Courses/Assignments';
import CourseMaterial from './Courses/CourseMaterial';
import Homework from './Courses/Homework';
import StudentAttendance from './Courses/StudentAttendance';
import TestSchedule from './Courses/TestSchedule';
import OldPaper from './Examination/OldPaper';
import PrepareResult from './Examination/PrepareResult';
import Result from './Examination/Result';
import FeeReport from './Fee/FeeReport';
import AddNotification from './Notification/AddNotification';
import StudentAchievement from './Notification/StudentAchievement';
import ViewNotification from './Notification/ViewNotification';
import Attendance from './Profile/Attendance';
import Schedule from './Profile/Schedule';
import Ledger from './Salary/Ledger';
import ViewSalary from './Salary/ViewSalary';

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
              {/* Profile */}
              <Route path="/view-profile" element={<ViewProfile />} />
              <Route path='/view-attendance' element={<Attendance />} />
              <Route path='/my-schedule' element={<Schedule />} />
              {/* Courses */}
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/course-materials" element={<CourseMaterial />} />
              <Route path="/homework" element={<Homework />} />
              <Route path="/student-attendance" element={<StudentAttendance />} />
              <Route path="/test-schedule" element={<TestSchedule />} />
              {/* Examination */}
              <Route path="/old-papers" element={<OldPaper />} />
              <Route path="/prepare-result" element={<PrepareResult />} />
              <Route path="/submit-result" element={<Result />} />
              {/* Salary */}
              <Route path="/view-ledger" element={<Ledger />} />
              <Route path="/view-salary" element={<ViewSalary />} />
              {/* Fee */}
              <Route path="/fee-report" element={<FeeReport />} />
              {/* Notification */}
              <Route path="/add-notification" element={<AddNotification />} />
              <Route path="/student-achievements" element={<StudentAchievement />} />
              <Route path="/view-notification" element={<ViewNotification />} />
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
