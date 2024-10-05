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
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);

  // Fetch teacher's class and subject details
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
        setTeacher(response.data);
        fetchClasses(response.data);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchTeacher();
  }, []);

  useEffect(() => {
    fetchHomework();
  }, []);

  // Fetch teacher's assigned classes
  const fetchClasses = async (teacherData) => {
    try {
      const response = await axios.get('http://localhost:7000/api/classes/getClasses');
      const teacherClasses = teacherData?.classYouTeach[0]?.split(',') || [];
      const filteredClasses = response.data.filter(cls =>
        teacherClasses.includes(cls.className)
      );
      setClasses(filteredClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Fetch sections based on the selected class
  useEffect(() => {
    if (form.className) {
      fetchSections(form.className);
    }
  }, [form.className]);

  // Fetch subjects based on the selected class and section
  useEffect(() => {
    if (form.className && form.sectionName) {
      fetchSubjects(form.className);
    }
  }, [form.className, form.sectionName]);

  // Fetch the sections for the selected class
  const fetchSections = async (className) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/sections/${className}/getSectionsByClassName`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Fetch subjects the teacher teaches
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
    setForm({ ...form, [name]: value });
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
    if (!teacher) return homeworkData;

    const teacherClasses = teacher.classYouTeach[0]?.split(',') || [];
    const teacherSubjects = teacher.subjectYouTeach[0]?.split(',') || [];

    return homeworkData.filter(homework =>
      teacherClasses.includes(homework.className) &&
      teacherSubjects.includes(Object.keys(homework.homework)[0]) // Get the subject name
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
            <label htmlFor="className" className="block">Class</label>
            <select
              id="className"
              name="className"
              value={form.className}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls.className}>{cls.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sectionName" className="block">Section</label>
            <select
              id="sectionName"
              name="sectionName"
              value={form.sectionName}
              onChange={handleInputChange}
              required
              disabled={!form.className}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec._id} value={sec.sectionName}>{sec.sectionName}</option>
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
              disabled={!form.className || !form.sectionName}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update Homework' : 'Add Homework'}
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
