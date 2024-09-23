import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherAttendance = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalOnLeave, setTotalOnLeave] = useState(0);

  // Replace with actual teacherId
  const teacherId = "66f12d8a8f27884ade9f1349";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teacherAttendances/getAttendanceByTeacherId/${teacherId}`);
        setAttendanceData(response.data);
        calculateTotals(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);

  const calculateTotals = (attendanceRecords) => {
    let presentCount = 0;
    let absentCount = 0;
    let onLeaveCount = 0;

    attendanceRecords.forEach(record => {
      record.teachers.forEach(teacher => {
        if (teacher.status === "Present") presentCount++;
        else if (teacher.status === "Absent") absentCount++;
        else if (teacher.status === "onLeave") onLeaveCount++;
      });
    });

    setTotalPresent(presentCount);
    setTotalAbsent(absentCount);
    setTotalOnLeave(onLeaveCount);
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthDays = [];

    monthDays.push(
      daysOfWeek.map((day, index) => (
        <div key={index} className="text-center font-semibold text-gray-600 text-xs sm:text-base">
          {day}
        </div>
      ))
    );

    for (let i = 0; i < firstDayOfWeek; i++) {
      monthDays.push(<div key={`empty-${i}`} className="border-b"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getFullYear() === currentYear && new Date().getMonth() === currentMonth && new Date().getDate() === day;
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const attendanceRecord = attendanceData.find(record => new Date(record.date).toLocaleDateString() === new Date(formattedDate).toLocaleDateString());

      let attendanceStatusClass = "";
      if (attendanceRecord) {
        const teacherAttendance = attendanceRecord.teachers.find(teacher => teacher.teacherId === teacherId);
        if (teacherAttendance) {
          if (teacherAttendance.status === "Present") attendanceStatusClass = "bg-green-600 text-white";
          else if (teacherAttendance.status === "Absent") attendanceStatusClass = "bg-red-500 text-white";
          else if (teacherAttendance.status === "onLeave") attendanceStatusClass = "bg-yellow-400 text-white";
          else if (teacherAttendance.status === "Late") attendanceStatusClass = "bg-orange-500 text-white";
        }
      }

      monthDays.push(
        <div
          key={day}
          className={`text-center py-2 border cursor-pointer rounded-lg transition duration-300 ease-in-out hover:bg-gray-200 hover:text-black ${attendanceStatusClass} ${isToday ? "bg-sky-400 text-white" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return monthDays;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const selectedRecord = attendanceData.find(record => new Date(record.date).toLocaleDateString() === new Date(formattedDate).toLocaleDateString());
    if (selectedRecord) {
      const teacherAttendance = selectedRecord.teachers.find(teacher => teacher.teacherId === teacherId);
      if (teacherAttendance) {
        setSelectedAttendance(teacherAttendance);
        setSelectedDate(new Date(currentYear, currentMonth, day).toLocaleDateString());
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonth];

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md w-full mt-2 max-w-sm sm:max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
        >
          <i className="fas fa-chevron-left mr-1"></i>
          <span className="hidden sm:inline">Previous</span>
        </button>
        <div className="text-base sm:text-lg font-semibold">
          {currentMonthName} {currentYear}
        </div>
        <button
          onClick={handleNextMonth}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
        >
          <span className="hidden sm:inline">Next</span>
          <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {generateCalendarDays()}
      </div>

      {/* Total Count Summary */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Attendance Summary:</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="text-green-600 font-semibold">
            Present: {totalPresent}
          </div>
          <div className="text-red-500 font-semibold">
            Absent: {totalAbsent}
          </div>
          <div className="text-orange-500 font-semibold">
            On Leave: {totalOnLeave}
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Legend:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-600 rounded-full mr-2"></div>
            Present
          </div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
            Absent
          </div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full mr-2"></div>
            Late
          </div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full mr-2"></div>
            On Leave
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-11/12 sm:w-1/3">
            <h3 className="text-lg font-semibold mb-2">
              Attendance on {selectedDate}
            </h3>
            {selectedAttendance ? (
              <div>
                <p>Status: {selectedAttendance.status}</p>
                {selectedAttendance.remark && <p>Remark: {selectedAttendance.remark}</p>}
                <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
                  Close
                </button>
              </div>
            ) : (
              <p>No attendance record found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
