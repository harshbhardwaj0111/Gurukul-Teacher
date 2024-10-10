import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Homework() {
  const [homeworkData, setHomeworkData] = useState([]);
  const [form, setForm] = useState({
    className: '',
    sectionName: '',
    subject: '',
    homework: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  // Fetch teacher's class and subject details
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
    fetchHomework();
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
    if (form.className) {
      fetchSubjects(form.className);
    }
  }, [form.className]);

  // Fetch subjects the teacher teaches
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

  // Fetch homework data
  const fetchHomework = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/homework/getAllHomework');
      setHomeworkData(response.data);
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the selected field is className
    if (name === 'className') {
      const [selectedClassName, selectedSectionName] = value.split('|'); // Split based on a unique separator

      // Update both className and sectionName
      setForm({
        ...form,
        className: selectedClassName,
        sectionName: selectedSectionName || '', // Default to an empty string if undefined
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Handle form submit for creating/updating homework
  const handleSubmit = async (e) => {
    e.preventDefault();
    const homeworkPayload = {
      className: form.className,
      sectionName: form.sectionName,
      homework: {
        [form.subject]: form.homework, // Send homework as a map
      },
    };

    try {
      if (editingId) {
        // If editing, use PUT method
        await axios.put(`http://localhost:7000/api/homework/updateHomework/${editingId}`, homeworkPayload);
        alert("Homework Updated Successfully");
      } else {
        // Otherwise, submit the new homework
        await axios.post('http://localhost:7000/api/homework/submitHomeworkForDate', homeworkPayload); // Use the new API
        alert("Homework Created Successfully");
      }
      setForm({ className: '', sectionName: '', subject: '', homework: '' });
      setEditingId(null);
      fetchHomework();
    } catch (error) {
      console.error('Error saving homework:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle edit action
  const handleEdit = (homework) => {
    setForm({
      className: homework.className,
      sectionName: homework.sectionName,
      subject: Object.keys(homework.homework)[0], // Get the subject name
      homework: homework.homework[Object.keys(homework.homework)[0]], // Get the corresponding homework
    });
    setEditingId(homework._id);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this homework?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7000/api/homework/deleteHomework/${id}`);
        fetchHomework();
      } catch (error) {
        console.error('Error deleting homework:', error);
      }
    }
  };

  // Filter homework by teacher's class and subject
  const getFilteredHomework = () => {
    return homeworkData.filter(homework =>
      classes.some(cls => cls.className === homework.className) &&
      subjects.includes(Object.keys(homework.homework)[0])
    );
  };

  // Clear the form after submit or edit cancel
  const clearForm = () => {
    setForm({ className: '', sectionName: '', subject: '', homework: '' });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Homework</h1>

      {/* Homework Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class</label>
            <select
              id="className"
              name="className"
              value={`${form.className}|${form.sectionName}`}
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
            <label htmlFor="subject" className="block">Subject</label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              required
              disabled={!form.className}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject,index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="homework" className="block">Homework</label>
            <textarea
              id="homework"
              name="homework"
              value={form.homework}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            ></textarea>
          </div>
        </div>

        <div className="mt-4">
          <button
          type="submit"
          className={`mt-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-600'} text-white p-2 md:px-6 rounded`}
          disabled={isLoading}
          >
            {isLoading ? 'Adding...' : editingId ? 'Update Homework' : 'Add Homework'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Homework List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Homework List</h2>
        <ul className="list-disc pl-5">
          {getFilteredHomework().map(homework => (
            <li key={homework._id} className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">{homework.subject}:</span> {homework.homework[homework.subject]}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(homework)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(homework._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Homework;
