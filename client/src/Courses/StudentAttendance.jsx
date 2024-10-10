import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherAttendance = () => {
  const [teacherClassIncharge, setTeacherClassIncharge] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [assignedSection, setAssignedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch teacher's class incharge info
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349'); // Replace with actual teacher API
        const teacherData = response.data;

        if (teacherData.classIncharge) {
          // Example: "10th (Rose)" => Class: "10th", Section: "Rose"
          const [className, sectionName] = teacherData.classIncharge.split(' (');

          setAssignedClass(className);
          setAssignedSection(sectionName.replace(')', ''));
          setTeacherClassIncharge(teacherData.classIncharge);
        } else {
          setMessage('You are not in charge of any class.');
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setMessage('Error fetching teacher information.');
      }
    };

    fetchTeacherInfo();
  }, []);

  // Fetch students of the assigned class and section
  useEffect(() => {
    if (assignedClass && assignedSection) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get('http://localhost:7000/api/students/getStudents');
          const filteredStudents = response.data.filter(student =>
            student.status === "active" && student.class === assignedClass && student.section === assignedSection
          );
          setStudents(filteredStudents);
          setAttendance(
            filteredStudents.map(student => ({
              rollNo: student.rollNo,
              studentId: student._id,
              date: new Date().toISOString().split('T')[0], // Default date: today
              status: 'Present', // Default status
              remark: ''
            }))
          );
        } catch (error) {
          console.error('Error fetching students:', error);
          setMessage('Error fetching students.');
        }
      };

      fetchStudents();
    }
  }, [assignedClass, assignedSection]);

  const handleChange = (index, event) => {
    const values = [...attendance];
    values[index][event.target.name] = event.target.value;
    setAttendance(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const attendanceData = {
      className: assignedClass,
      sectionName: assignedSection,
      students: attendance
    };

    try {
      const response = await axios.post('http://localhost:7000/api/attendance/createAttendance', attendanceData);
      setMessage(`Attendance has been successfully submitted for Class: ${assignedClass} (${assignedSection}). Thank you for your diligence in maintaining accurate records.`);
      // Reset attendance if needed
      setAttendance([]); // Optionally clear the attendance array
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setMessage('Oops! There was a problem with the attendance submission. Please attempt again shortly.');
    }
  };

  if (message) {
    return <div className="text-green-600 text-center mt-8">{message}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-full mx-auto md:p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-6 text-center">
        <i className="md:hidden fas fa-user-check text-purple-500 mr-2"></i>
        Attendance for {teacherClassIncharge}
      </h2>

      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-center border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 md:px-4 border-b">Sr No.</th>
                <th className="py-2 px-2 md:px-4 border-b">Roll No</th>
                <th className="py-2 px-2 md:px-4 border-b">Student Name</th>
                <th className="py-2 px-2 md:px-4 border-b">Status</th>
                <th className="py-2 px-2 md:px-4 border-b">Remark</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.rollNo}>
                  <td className="border px-2 md:px-4 py-2">{index + 1}</td>
                  <td className="border px-2 md:px-4 py-2">{student.rollNo}</td>
                  <td className="border px-2 md:px-4 py-2">{student.firstName}</td>
                  <td className="border px-2 md:px-4 py-2">
                    <select
                      name="status"
                      value={attendance[index].status}
                      onChange={(event) => handleChange(index, event)}
                      className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="onLeave">On Leave</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                  <td className="border px-2 md:px-4 py-2">
                    <input
                      type="text"
                      name="remark"
                      value={attendance[index].remark}
                      onChange={(event) => handleChange(index, event)}
                      className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter remark"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-4 text-gray-500">No students found for {assignedClass} ({assignedSection}).</div>
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Submit Attendance
      </button>
    </form>
  );
};

export default TeacherAttendance;
