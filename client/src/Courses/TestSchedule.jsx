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
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
        setTeacher(response.data);
        // Fetch classes only after teacher data is set
        fetchClasses(response.data);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchTeacher();
  }, []);

  useEffect(() => {
    fetchTestSchedules();
  }, []);

  // Fetch classes only after the teacher is fetched
  const fetchClasses = async (teacherData) => {
    try {
      const response = await axios.get('http://localhost:7000/api/classes/getClasses');
      // Split the classYouTeach array into individual classes and filter
      const teacherClasses = teacherData?.classYouTeach[0]?.split(',') || []; // Assuming classYouTeach is an array with one string
      const filteredClasses = response.data.filter(cls =>
        teacherClasses.includes(cls.className)
      );
      setClasses(filteredClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (form.class) {
      fetchSections(form.class);
    }
  }, [form.class]);

  useEffect(() => {
    if (form.class && form.section) {
      fetchSubjects(form.class);
    }
  }, [form.class, form.section]);

  const fetchTestSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/testSchedules/getTestSchedules');
      setTestSchedules(response.data);
    } catch (error) {
      console.error('Error fetching test schedules:', error);
    }
  };

  const fetchSections = async (className) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/sections/${className}/getSectionsByClassName`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchSubjects = async (className) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/subjects/${className}/getSubjectsByClassName`);
      const teacherSubjects = teacher?.subjectYouTeach[0]?.split(',') || [];
      const filteredSubjects = response.data.filter(sub =>
        teacherSubjects.includes(sub.subjectName)
      );
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/api/testSchedules/updateTestSchedule/${editingId}`, form);
      } else {
        await axios.post('http://localhost:7000/api/testSchedules/createTestSchedule', form);
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
    }
  };

  const handleEdit = (schedule) => {
    setForm(schedule);
    setEditingId(schedule._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/testSchedules/deleteTestSchedule/${id}`);
      fetchTestSchedules();
    } catch (error) {
      console.error('Error deleting test schedule:', error);
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <h1 className="text-xl md:text-3xl font-bold text-center md:mb-4"><i className="md:hidden fas fa-clipboard-list mr-2"></i>Test Schedule</h1>
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
              value={form.class}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
            <select
              id="section"
              name="section"
              value={form.section}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
              disabled={!form.class}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec._id} value={sec.sectionName}>
                  {sec.sectionName}
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
              disabled={!form.class || !form.section}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub.subjectName}>
                  {sub.subjectName}
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
          className="mt-4 bg-blue-800 hover:bg-blue-600 text-white p-2 md:px-6 rounded"
        >
          {editingId ? 'Update Test Schedule' : 'Add Test Schedule'}
        </button>
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
            {testSchedules.map((schedule, index) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Format for Mobile Screens */}
      <div className="block md:hidden">
        {testSchedules.map((schedule, index) => (
          <div key={schedule._id} className="bg-white border shadow-md rounded p-4 mb-4">
            <h3 className="font-bold">{schedule.testName}</h3>
            <p>Class: {schedule.class} ({schedule.section})</p>
            <p>Subject: {schedule.subject}</p>
            <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
            <p>Timing: {schedule.startTime} - {schedule.endTime}</p>
            <p>Invigilator: {schedule.invigilator}</p>
            <p>Room: {schedule.roomNumber}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestSchedule;
