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
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
    fetchCourseMaterials();
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

  const fetchCourseMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/coursematerial/getAllCourseMaterials');
      setCourseMaterials(response.data);
    } catch (error) {
      console.error('Error fetching course materials:', error);
    }
  };

  // Update fetchSubjects to use the new API endpoint
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

  // Filter course materials based on selected class and subject
  const getFilteredCourseMaterials = () => {
    return courseMaterials.filter(material => {
      return (
        (form.className === '' || material.className === form.className) &&
        (form.subjectName === '' || material.subjectName === form.subjectName)
      );
    });
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
    disabled={!form.className}
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
              required
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
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-600'} text-white p-2 md:px-6 rounded`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : editingId ? 'Update Course Material' : 'Add Course Material'}
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

      <h2 className="text-xl font-bold mb-4">Course Materials</h2>
      {/* Responsive Table for Larger Screens */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border text-center border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2">SR No.</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getFilteredCourseMaterials().map((material, index) => (
              <tr key={material._id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{material.className} ({material.sectionName})</td>
                <td className="px-4 py-2">{material.subjectName}</td>
                <td className="px-4 py-2">{material.title}</td>
                <td className="px-4 py-2">
                  <a href={material.courseMaterialFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View File
                  </a>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-row justify-center gap-4">
                    <button
                      onClick={() => handleEdit(material)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 transition duration-200 "
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="bg-red-600 text-white rounded px-2 py-1 hover:bg-red-500 transition duration-200 "
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

      {/* Responsive Cards for Mobile View */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {getFilteredCourseMaterials().map((material) => (
          <div key={material._id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold"><i className="fas fa-pen text-yellow-900 mr-2"></i>{material.title}</h3>
            <p><i className="fas fa-chalkboard-teacher text-teal-500 mr-2"></i>{material.className} ({material.sectionName})</p>
            <p><i className="fas fa-book text-green-500 mr-2"></i>
              {material.subjectName}</p>
            <div className="flex justify-between mt-2">
              <a href={material.courseMaterialFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                <i className="fas fa-eye mr-1"></i>View File
              </a>
              <button onClick={() => handleEdit(material)} className="text-yellow-500 hover:underline">
                <i className="fas fa-edit mr-1"></i>Edit
              </button>
              <button onClick={() => handleDelete(material._id)} className="text-red-500 hover:underline">
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseMaterial;
