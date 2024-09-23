import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewTeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
        setTeacher(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Teacher Profile</h1>
      <hr />
      <br />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center row-span-3">
          {teacher.profileImage && (
            <img
              src={teacher.profileImage}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="rounded-lg shadow-lg w-64 h-64 object-cover"
            />
          )}
        </div>

        {teacher.firstName && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Name:</strong>
            <div className="text-gray-900">{teacher.firstName} {teacher.lastName}</div>
          </div>
        )}

        {teacher.phoneNo && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Phone Number:</strong>
            <div className="text-gray-900">{teacher.phoneNo}</div>
          </div>
        )}

        {teacher.phoneNo2 && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Alternate Phone Number:</strong>
            <div className="text-gray-900">{teacher.phoneNo2}</div>
          </div>
        )}

        {teacher.email && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Email:</strong>
            <div className="text-gray-900">{teacher.email}</div>
          </div>
        )}

        {teacher.gender && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Gender:</strong>
            <div className="text-gray-900">{teacher.gender}</div>
          </div>
        )}

        {teacher.dateOfBirth && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Date of Birth:</strong>
            <div className="text-gray-900">{new Date(teacher.dateOfBirth).toLocaleDateString()}</div>
          </div>
        )}

        {teacher.age && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Age:</strong>
            <div className="text-gray-900">{teacher.age}</div>
          </div>
        )}

        {teacher.state && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">State:</strong>
            <div className="text-gray-900">{teacher.state}</div>
          </div>
        )}

        {teacher.city && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">City:</strong>
            <div className="text-gray-900">{teacher.city}</div>
          </div>
        )}

        {teacher.address && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Address:</strong>
            <div className="text-gray-900">{teacher.address}</div>
          </div>
        )}

        {teacher.category && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Category:</strong>
            <div className="text-gray-900">{teacher.category}</div>
          </div>
        )}

        {teacher.financial && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Financial Status:</strong>
            <div className="text-gray-900">{teacher.financial}</div>
          </div>
        )}

        {teacher.tenthDmc && teacher.tenthDmc !== "null" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium">10th DMC:</span>
            <a href={teacher.tenthDmc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Document
            </a>
          </div>
        )}

        {teacher.plusTwoDmc && teacher.plusTwoDmc !== "null" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium">Plus Two DMC:</span>
            <a href={teacher.plusTwoDmc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Document
            </a>
          </div>
        )}

        {teacher.graduation && teacher.graduation !== "null" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium">Graduation:</span>
            <a href={teacher.graduation} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Document
            </a>
          </div>
        )}

        {teacher.masters && teacher.masters !== "null" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium">Masters:</span>
            <a href={teacher.masters} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Document
            </a>
          </div>
        )}

        {teacher.diploma && teacher.diploma !== "null" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium">Diploma:</span>
            <a href={teacher.diploma} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Document
            </a>
          </div>
        )}

        {teacher.classYouTeach && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Classes You Teach:</strong>
            <div className="text-gray-900">{teacher.classYouTeach.join(', ')}</div>
          </div>
        )}

        {teacher.subjectYouTeach && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Subjects You Teach:</strong>
            <div className="text-gray-900">{teacher.subjectYouTeach.join(', ')}</div>
          </div>
        )}

        {teacher.qualification && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Qualification:</strong>
            <div className="text-gray-900">{teacher.qualification}</div>
          </div>
        )}

        {teacher.experiencePeriod && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Experience Period:</strong>
            <div className="text-gray-900">{teacher.experiencePeriod}</div>
          </div>
        )}

        {teacher.organization && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Organization:</strong>
            <div className="text-gray-900">{teacher.organization}</div>
          </div>
        )}

        {teacher.designation && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Designation:</strong>
            <div className="text-gray-900">{teacher.designation}</div>
          </div>
        )}

        {teacher.personalAchievements && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Personal Achievements:</strong>
            <div className="text-gray-900">{teacher.personalAchievements}</div>
          </div>
        )}

        {teacher.classIncharge && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <strong className="block text-gray-700">Class Incharge:</strong>
            <div className="text-gray-900">{teacher.classIncharge}</div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ViewTeacherProfile;
