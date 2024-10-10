import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Result = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [scores, setScores] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingResultId, setEditingResultId] = useState('');
  const [results, setResults] = useState([]); // To hold fetched results
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

  // Fetch classes based on teacher's name
  const fetchClasses = async (teacherName) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/timetable/getTeacherClasses/${teacherName}`); // Update API endpoint
      setClasses(response.data); // Assuming response.data is an array of classes
    } catch (error) {
      console.error('Error fetching classes:', error);
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

  useEffect(() => {
    if (selectedClass) {
      axios.get(`http://localhost:7000/api/sections/${selectedClass}/getSectionsByClassName`)
        .then(response => setSections(response.data))
        .catch(error => console.error('Error fetching sections:', error));

      axios.get(`http://localhost:7000/api/exams/getExamByClass/${selectedClass}`)
        .then(response => setExams(response.data))
        .catch(error => console.error('Error fetching exams:', error));

      // Fetch subjects based on the selected class
      fetchSubjects(selectedClass);
    }
  }, [selectedClass, teacher]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      axios.get('http://localhost:7000/api/students/getStudents')
        .then(response => {
          const filteredStudents = response.data.filter(student =>
            student.class === selectedClass && student.section === selectedSection
          );
          const activeStudents = filteredStudents.filter(student => student.status === 'active');
          setStudents(activeStudents);
        })
        .catch(error => console.error('Error fetching students:', error));
    }
  }, [selectedClass, selectedSection]);

  const handleSubjectMarksChange = (subjectName, value) => {
    setSubjectMarks(prevMarks => ({
      ...prevMarks,
      [subjectName]: value,
    }));
  };

  const handleScoreChange = (studentId, subjectName, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [studentId]: {
        ...prevScores[studentId],
        [subjectName]: score,
      },
    }));
  };

  const handleSubmit = async () => {
    const resultData = {
      examName: selectedExam,
      className: selectedClass,
      sectionName: selectedSection,
      subjects: selectedSubjects.map(subject => ({
        subjectName: subject.value,
        totalMarks: subjectMarks[subject.value] || 0,
      })),
      students: students.map(student => ({
        studentId: student._id,
        rollNo: student.rollNo,
        studentName: `${student.firstName} ${student.lastName}`,
        scores: selectedSubjects.map(subject => ({
          subjectName: subject.value,
          score: scores[student._id]?.[subject.value] || 0,
        })),
      })),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:7000/api/subjectResults/update/${editingResultId}`, resultData);
        alert("Exam result updated successfully");
      } else {
        await axios.post('http://localhost:7000/api/subjectResults/create', resultData);
        alert("Exam result saved successfully");
      }
      fetchResults(); // Refresh the results after submission
      clearForm(); // Clear the form or handle further UI changes
    } catch (error) {
      console.error('Error saving/updating exam result:', error);
      alert("Error saving/updating exam result");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/api/subjectResults`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleEdit = (result) => {
    setSelectedClass(result.className);
    setSelectedSection(result.sectionName);
    setSelectedExam(result.examName);
    setSubjectMarks(result.subjects.reduce((acc, subject) => ({
      ...acc,
      [subject.subjectName]: subject.totalMarks,
    }), {}));
    setScores(result.students.reduce((acc, student) => ({
      ...acc,
      [student.studentId]: student.scores.reduce((subAcc, score) => ({
        ...subAcc,
        [score.subjectName]: score.score,
      }), {}),
    }), {}));
    setEditingResultId(result._id);
    setIsEditing(true);
  };

  const handleDelete = async (resultId) => {
    try {
      await axios.delete(`http://localhost:7000/api/subjectResults/delete/${resultId}`);
      alert("Exam result deleted successfully");
      fetchResults(); // Refresh the results after deletion
    } catch (error) {
      console.error('Error deleting exam result:', error);
      alert("Error deleting exam result");
    }
  };

  const clearForm = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedExam('');
    setSubjectMarks({});
    setScores({});
    setSelectedSubjects([]);
    setIsEditing(false);
    setEditingResultId('');
  };

  useEffect(() => {
    fetchResults(); // Fetch results when component mounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the selected field is className
    if (name === 'className') {
      const [selectedClassName, selectedSectionName] = value.split('|'); // Split based on a unique separator

      setSelectedClass(selectedClassName);
      setSelectedSection(selectedSectionName);
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Exam Results</h2>
      {/* Class, Section, and Exam selection */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">Class :</label>
          <select
            id='className'
            name='className'
            value={`${selectedClass}|${selectedSection}`}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={`${cls.className}|${cls.sectionName}`}>
                {cls.className} ({cls.sectionName})
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Exam Name</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam.examName}>{exam.examName}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Subject Selection using react-select */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Subjects:</label>
        <Select
          isMulti
          options={subjects.map(subject => ({ value: subject, label: subject }))}
          value={selectedSubjects}
          onChange={setSelectedSubjects}
          className="w-full"
        />
      </div>

      {/* Marks input for each subject */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-4">Subjects with Total Marks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-4xl bg-white shadow-md rounded-lg mb-8">
            <thead className='bg-gray-100'>
              <tr>
                <th className="px-6 py-2 text-gray-800">Subject Name</th>
                <th className="px-6 py-2 text-gray-800">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {selectedSubjects.map((subject) => (
                <tr key={subject.value}>
                  <td className="border px-6 py-4 text-center">{subject.label}</td>
                  <td className="border px-6 py-4 text-center">
                    <input
                      type="number"
                      value={subjectMarks[subject.value] || ''}
                      onChange={(e) => handleSubjectMarksChange(subject.value, e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Results Entry */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Student Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg mb-8">
            <thead className='bg-gray-100'>
              <tr>
                <th className="px-6 py-2 text-gray-800">Sr No.</th>
                <th className="px-6 py-2 text-gray-800">Roll No.</th>
                <th className="px-6 py-2 text-gray-800">Student Name</th>
                {selectedSubjects.map((subject) => (
                  <th key={subject.value} className="px-6 py-2 text-gray-800">{subject.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td className="border px-6 py-4 text-center">{index + 1}</td>
                  <td className="border px-6 py-4 text-center">{student.rollNo}</td>
                  <td className="border px-6 py-4 text-center">{student.firstName} {student.lastName}</td>
                  {selectedSubjects.map((subject) => (
                    <td key={subject.value} className="border px-6 py-4 text-center">
                      <input
                        type="number"
                        value={scores[student._id]?.[subject.value] || ''}
                        onChange={(e) => handleScoreChange(student._id, subject.value, e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className={`mt-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-600'} text-white p-2 md:px-6 rounded`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : isEditing ? 'Update Result' : 'Save Result'}
        </button>
        {isEditing && (
          <button
            onClick={clearForm}
            className="bg-gray-600 text-white py-2 px-4 ml-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>
      {/* Results Table */}
      <h3 className="text-xl font-semibold mt-6 mb-2">All Exam Results</h3>
      {results.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-center">
          <thead className='bg-gray-200'>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Sr No.</th>
              <th className="border border-gray-300 px-4 py-2">Exam Name</th>
              <th className="border border-gray-300 px-4 py-2">Class</th>
              <th className="border border-gray-300 px-4 py-2">Section</th>
              <th className="border border-gray-300 px-4 py-2">Subjects</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{result.examName}</td>
                <td className="border border-gray-300 px-4 py-2">{result.className}</td>
                <td className="border border-gray-300 px-4 py-2">{result.sectionName}</td>
                <td className="py-2 px-4 border-b">
                  {result.subjects.map(sub => sub.subjectName).join(', ')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(result)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                  >
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button
                    onClick={() => handleDelete(result._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2"
                  >
                    <i className="fas fa-trash mr-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Result;
