import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestSchedule() {
  const [testSchedules, setTestSchedules] = useState([]);
  const [form, setForm] = useState({
    testName: '',
    subject: '',
    class: '',
    section: '',
    date: '',
    startTime: '',
    endTime: '',
    invigilator: '',
    roomNumber: '',
    additionalNotes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
        setTeacher(response.data);

        // Destructure the teacher's first and last name from the response
        const { firstName, lastName } = response.data;

        // Fetch classes using the teacher's full name
        fetchClasses(`${firstName} ${lastName}`);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchTeacher();
  }, []);

  useEffect(() => {
    fetchTestSchedules();
  }, []);

  // Fetch classes based on teacher's name
  const fetchClasses = async (teacherName) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/timetable/getTeacherClasses/${teacherName}`); // Update API endpoint
      setClasses(response.data); // Assuming response.data is an array of classes
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (form.class) {
      fetchSubjects(form.class);
    }
  }, [form.class]);

  const fetchTestSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/testSchedules/getTestSchedules');
      setTestSchedules(response.data);
    } catch (error) {
      console.error('Error fetching test schedules:', error);
    }
  };

  const fetchSubjects = async (className) => {
    if (!teacher) return; // Return if teacher data isn't available yet
    try {
      const { firstName, lastName } = teacher;
      const response = await axios.get(`http://localhost:7000/api/timetable/getSubjectsByTeacherAndClass/${firstName}%20${lastName}/${className}`);
      console.log(response.data);
      // Check if the response is an array before setting state
      if (Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects); // Assuming the API returns the subjects correctly
      } else {
        setSubjects([]); // Reset to an empty array if the response is not an array
        console.error('Expected an array but got:', response.data); // Log the unexpected response
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the selected field is class
    if (name === 'class') {
      const [selectedClassName, selectedSectionName] = value.split('|'); // Split based on a unique separator

      // Update both class and section
      setForm({
        ...form,
        class: selectedClassName,
        section: selectedSectionName || '', // Default to an empty string if undefined
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/api/testSchedules/updateTestSchedule/${editingId}`, form);
        alert("Updated Successfully");
      } else {
        await axios.post('http://localhost:7000/api/testSchedules/createTestSchedule', form);
        alert("Created Successfully");
      }
      setForm({
        testName: '',
        subject: '',
        class: '',
        section: '',
        date: '',
        startTime: '',
        endTime: '',
        invigilator: '',
        roomNumber: '',
        additionalNotes: ''
      });
      setEditingId(null);
      fetchTestSchedules();
    } catch (error) {
      console.error('Error saving test schedule:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleEdit = (schedule) => {
    setForm(schedule);
    setEditingId(schedule._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Test Schedule?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7000/api/testSchedules/deleteTestSchedule/${id}`);
        fetchTestSchedules();
      } catch (error) {
        console.error('Error deleting test schedule:', error);
      }
    }
  };

  const getFilteredTestSchedules = () => {
    return testSchedules.filter(material => {
      return (
        (form.class === '' || material.class === form.class) &&
        (form.section === '' || material.section === form.section) &&
        (form.subject === '' || material.subject === form.subject)
      );
  });
  };


  const clearForm = () => {
    setForm({
      testName: '',
      subject: '',
      class: '',
      section: '',
      date: '',
      startTime: '',
      endTime: '',
      invigilator: '',
      roomNumber: '',
      additionalNotes: ''
    });
    setEditingId(null);
  }

  return (
    <div className="container mx-auto md:p-4">
      <h1 className="text-xl md:text-3xl font-bold text-center md:mb-4"><i className="md:hidden text-blue-400 fas fa-clipboard-list mr-2"></i>Test Schedule</h1>
      <form onSubmit={handleSubmit} className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="testName" className="block text-sm font-medium text-gray-700">Test Name</label>
            <input
              type="text"
              id="testName"
              name="testName"
              value={form.testName}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
            <select
              id="class"
              name="class"
              value={`${form.class}|${form.section}`}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={`${cls.className}|${cls.sectionName}`}>
                  {cls.className} ({cls.sectionName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
              disabled={!form.class}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject, index) => ( // Map over the subjects array
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={form.endTime}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="invigilator" className="block text-sm font-medium text-gray-700">Invigilator</label>
            <input
              type="text"
              id="invigilator"
              name="invigilator"
              value={form.invigilator}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-600'} text-white p-2 md:px-6 rounded`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : editingId ? 'Update Test Schedule' : 'Add Test Schedule'}
        </button>
        {editingId && (
          <button
            onClick={clearForm}
            className="bg-gray-600 text-white py-2 px-4 ml-4 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mb-4">Test Schedules</h2>
      {/* Responsive Table for Larger Screens */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border text-center border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2">SR No.</th>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Timing</th>
              <th className="px-4 py-2">Invigilator</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='bg-gray-50'>
            {form.class && form.subject ? (
              getFilteredTestSchedules().length > 0 ? (
              getFilteredTestSchedules().map((schedule, index) => (
              <tr key={schedule._id} className='hover:bg-gray-100'>
                <td className="px-4 py-2 border-b border-gray-300">{index + 1}</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.testName}</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.class} ({schedule.section})</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.subject}</td>
                <td className="px-4 py-2 border-b border-gray-300">{new Date(schedule.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.startTime} - {schedule.endTime}</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.invigilator}</td>
                <td className="px-4 py-2 border-b border-gray-300">{schedule.roomNumber}</td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400"
                      onClick={() => handleEdit(schedule)}
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                      onClick={() => handleDelete(schedule._id)}
                    >
                      <i className="fas fa-trash mr-1"></i>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-2 text-center">No test schedule found.</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center">Please select a class and subject to see the test schedules.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Format for Mobile Screens */}
      <div className="block md:hidden">
        {form.class && form.subject ? (
          getFilteredTestSchedules().length > 0 ? (
          getFilteredTestSchedules().map((schedule, index) => (
          <div key={schedule._id} className="bg-white border shadow-md rounded p-4 mb-4">
            <h3 className="font-bold"><i className="fas fa-pen text-blue-600 mr-2"></i>{schedule.testName}</h3>
            <p><i className="fas fa-chalkboard-teacher text-teal-500 mr-2"></i>{schedule.class} ({schedule.section})</p>
            <p><i className="fas fa-book text-purple-500 mr-2"></i>{schedule.subject}</p>
            <p><i className="fas fa-calendar-alt text-cyan-600 mr-2"></i>{new Date(schedule.date).toLocaleDateString()}</p>
            <p><i className="fas fa-clock text-orange-500 mr-2"></i>{schedule.startTime} - {schedule.endTime}</p>
            <p><i className="fas fa-user-check text-blue-500 mr-2"></i>
            {schedule.invigilator}</p>
            <p><i className="fas fa-door-open text-yellow-800 mr-2"></i>{schedule.roomNumber}</p>
            <div className="flex justify-end mt-2 gap-4">
              <button onClick={() => handleEdit(schedule)} className="text-yellow-500 hover:underline">
                <i className="fas fa-edit mr-1"></i>Edit
              </button>
              <button onClick={() => handleDelete(schedule._id)} className="text-red-500 hover:underline">
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            </div>
          </div>
        ))
          ) : (
            <div className="border rounded p-4 bg-white shadow text-center">
              <p>No test schedules found.</p>
            </div>
          )
        ) : (
          <div className="border rounded p-4 bg-white shadow text-center">
            <p>Please select a class and subject to see the test schedules.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestSchedule;
