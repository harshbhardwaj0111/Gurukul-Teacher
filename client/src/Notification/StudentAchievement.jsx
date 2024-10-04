import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAchievement = () => {
  const [teacherClassIncharge, setTeacherClassIncharge] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [assignedSection, setAssignedSection] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [eventData, setEventData] = useState({
    sectionName: assignedSection, // Set sectionName from user data
    eventName: '',
    eventDate: '',
    shortDescription: '',
    longDescription: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch teacher's class incharge info
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349'); // Replace with actual teacher API
        const teacherData = response.data;

        if (teacherData.classIncharge) {
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

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/studentAchievements/getStudentAchievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/api/studentAchievements/updateStudentAchievement/${editingId}`, {
          className: assignedClass, // Set className from user data
          sectionName: assignedSection,
          eventName: eventData.eventName,
          eventDate: eventData.eventDate,
          shortDescription: eventData.shortDescription,
          longDescription: eventData.longDescription
        });
        alert('Event successfully updated!');
      } else {
        await axios.post('http://localhost:7000/api/studentAchievements/createStudentAchievement', {
          className: assignedClass, // Set className from user data
          sectionName: assignedSection,
          eventName: eventData.eventName,
          eventDate: eventData.eventDate,
          shortDescription: eventData.shortDescription,
          longDescription: eventData.longDescription
        });
        alert('Event successfully added!');
      }
      resetForm();
      fetchAchievements(); // Refresh the achievements list
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to submit event. Please try again.');
    }
  };

  const handleEdit = (id) => {
    const achievement = achievements.find((item) => item._id === id);
    setEventData({
      className: achievement.className,
      sectionName: achievement.sectionName,
      eventName: achievement.eventName,
      eventDate: achievement.eventDate,
      shortDescription: achievement.shortDescription,
      longDescription: achievement.longDescription
    });
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this achievement?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7000/api/studentAchievements/deleteStudentAchievement/${id}`);
        alert('Event successfully deleted!');
        fetchAchievements(); // Refresh the achievements list
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setEventData({
      sectionName: assignedSection, // Reset sectionName to user data
      eventName: '',
      eventDate: '',
      shortDescription: '',
      longDescription: ''
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-full flex flex-col items-start justify-center">
      <div className="bg-white p-2 md:p-6 w-full max-w-full">
        <h2 className="text-xl md:text-3xl font-bold text-center md:mb-4">
          <i className="md:hidden text-yellow-400 fas fa-trophy mr-2"></i>
          {eventData.eventName ? `Edit Achievement of ${assignedClass} (${assignedSection})` : `Add Student Achievement of ${assignedClass} (${assignedSection})`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-700 font-semibold mb-1" htmlFor="eventName">Event Name:</label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold mb-1" htmlFor="eventDate">Event Date:</label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-semibold mb-1" htmlFor="shortDescription">Short Description:</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={eventData.shortDescription}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter a brief description of the event"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-semibold mb-1" htmlFor="longDescription">Long Description (Optional):</label>
            <textarea
              id="longDescription"
              name="longDescription"
              value={eventData.longDescription}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter a detailed description of the event"
              rows="4"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-800 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              {editingId ? 'Update Achievement' : 'Add Achievement'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Display Achievements */}
      <div className="bg-white p-6 w-full max-w-full">
        <h2 className="text-2xl font-bold mb-5">Achievements List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.length > 0 ? (
            achievements
              .filter(achievement => achievement.className === assignedClass && achievement.sectionName === assignedSection)
              .map((achievement) => (
                <div key={achievement._id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{achievement.eventName}</h3>
                  <p className="text-gray-600 mb-2">
                    <strong className="hidden md:inline">Class:</strong><i className="md:hidden fas fa-chalkboard-teacher text-teal-500 mr-1"></i> {achievement.className} ({achievement.sectionName})
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong className="hidden md:inline">Date:</strong><i className="md:hidden fas fa-calendar-alt text-cyan-600 mr-1"></i> {new Date(achievement.eventDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong className="hidden md:inline">Short Description:</strong> {achievement.shortDescription}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong className="hidden md:inline">Long Description:</strong> {achievement.longDescription}
                  </p>
                  <div>
                    {/* Mobile view buttons */}
                    <div className="flex justify-end mt-2 gap-4 md:hidden"> {/* Hidden on laptop view */}
                      <button onClick={() => handleEdit(achievement._id)} className="text-yellow-500 hover:underline">
                        <i className="fas fa-edit mr-1"></i>Edit
                      </button>
                      <button onClick={() => handleDelete(achievement._id)} className="text-red-500 hover:underline">
                        <i className="fas fa-trash mr-1"></i>Delete
                      </button>
                    </div>

                    {/* Laptop view buttons */}
                    <div className="hidden md:flex justify-between mt-3"> {/* Hidden on mobile view */}
                      <button
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-400 transition duration-200"
                        onClick={() => handleEdit(achievement._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-400 transition duration-200"
                        onClick={() => handleDelete(achievement._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>No achievements found for this class and section.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAchievement;
