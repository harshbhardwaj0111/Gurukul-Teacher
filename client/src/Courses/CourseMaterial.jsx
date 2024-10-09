import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseMaterial() {
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subjectName: '',
    className: '',
    sectionName: '',
    file: null,
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
        setTeacher(response.data);
        // Fetch classes only after teacher data is set
        fetchClasses(response.data.name); // Use teacher's name
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchTeacher();
  }, []);

  useEffect(() => {
    fetchCourseMaterials();
  }, []);

  // Fetch classes based on teacher's name
  const fetchClasses = async (teacherName) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/timetable/getTeacherClasses/Rinku%20Singh`); // Update API endpoint
      setClasses(response.data); // Assuming response.data is an array of classes
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (form.className && form.sectionName) {
      fetchSubjects(form.className);
    }
  }, [form.className, form.sectionName]);

  const fetchCourseMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/coursematerial/getAllCourseMaterials');
      setCourseMaterials(response.data);
    } catch (error) {
      console.error('Error fetching course materials:', error);
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

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subjectName', form.subjectName);
    formData.append('className', form.className);
    formData.append('sectionName', form.sectionName);
    formData.append('file', form.file);
    formData.append('description', form.description);

    setIsLoading(true); // Start loading

    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/api/coursematerial/updateCourseMaterial/${editingId}`, formData);
        alert("Course material updated successfully");
      } else {
        await axios.post('http://localhost:7000/api/coursematerial/createCourseMaterial', formData);
        alert("Course material created successfully");
      }
      setForm({
        title: '',
        subjectName: '',
        className: '',
        sectionName: '',
        file: null,
        description: ''
      });
      setEditingId(null);
      fetchCourseMaterials();
    } catch (error) {
      console.error('Error saving course material:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleEdit = (material) => {
    setForm(material);
    setEditingId(material._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course material?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7000/api/coursematerial/deleteCourseMaterial/${id}`);
        fetchCourseMaterials();
      } catch (error) {
        console.error('Error deleting course material:', error);
      }
    }
  };

  const getFilteredCourseMaterials = () => {
    if (!teacher) return courseMaterials; // If teacher data isn't available yet, return all materials

    const teacherClasses = teacher.classYouTeach[0]?.split(',') || [];
    const teacherSubjects = teacher.subjectYouTeach[0]?.split(',') || [];

    return courseMaterials.filter(material =>
      teacherClasses.includes(material.className) &&
      teacherSubjects.includes(material.subjectName)
    );
  };

  const clearForm = () => {
    setForm({
      title: '',
      subjectName: '',
      className: '',
      sectionName: '',
      file: null,
      description: ''
    });
    setEditingId(null);
  }

  return (
    <div className="container mx-auto md:p-4">
      <h1 className="text-xl md:text-3xl font-bold text-center md:mb-4"><i className="md:hidden text-red-500 fas fa-book-open mr-2"></i>Course Materials</h1>
      <form onSubmit={handleSubmit} className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-6">
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
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              id="subjectName"
              name="subjectName"
              value={form.subjectName}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
              disabled={!form.className || !form.sectionName}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              rows="3"
            />
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {isLoading ? 'Saving...' : editingId ? 'Update Material' : 'Add Material'}
          </button>
          <button type="button" onClick={clearForm} className="bg-gray-300 text-gray-800 px-4 py-2 rounded ml-2">
            Clear Form
          </button>
        </div>
      </form>

      <h2 className="text-xl md:text-2xl font-semibold mb-2">Course Materials List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Subject</th>
            <th className="py-3 px-6 text-left">Class</th>
            <th className="py-3 px-6 text-left">Section</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {getFilteredCourseMaterials().map(material => (
            <tr key={material._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{material.title}</td>
              <td className="py-3 px-6 text-left">{material.subjectName}</td>
              <td className="py-3 px-6 text-left">{material.className}</td>
              <td className="py-3 px-6 text-left">{material.sectionName}</td>
              <td className="py-3 px-6 text-left">{material.description}</td>
              <td className="py-3 px-6 text-center">
                <button onClick={() => handleEdit(material)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(material._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseMaterial;
