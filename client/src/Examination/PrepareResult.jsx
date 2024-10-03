import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrepareResult = () => { // Class and Section are passed as props
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState({});
  const [scores, setScores] = useState({});
  const [examResults, setExamResults] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingResultId, setEditingResultId] = useState('');
  const [message, setMessage] = useState('');
  const [teacherClassIncharge, setTeacherClassIncharge] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [assignedSection, setAssignedSection] = useState('');
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
      }
    };

    fetchTeacherInfo();
  }, []);

  useEffect(() => {
    // Fetch exams for the specified class
    axios.get(`http://localhost:7000/api/exams/getExamByClass/${assignedClass}`)
      .then(response => setExams(response.data))
      .catch(error => console.error('Error fetching exams:', error));
      
    // Fetch students for the specified class and section
    axios.get('http://localhost:7000/api/students/getStudents')
      .then(response => {
        const filteredStudents = response.data.filter(student =>
          student.class === assignedClass && student.section === assignedSection
        );
        setStudents(filteredStudents);
      })
      .catch(error => console.error('Error fetching students:', error));
      
    // Fetch subjects for the specified class
    axios.get(`http://localhost:7000/api/subjects/${assignedClass}/getSubjectsByClassName`)
      .then(response => {
        setSubjects(response.data);
        const marks = {};
        response.data.forEach(subject => {
          marks[subject.subjectName] = subject.totalMarks || 0; // Initialize with existing or zero
        });
        setSubjectMarks(marks);
      })
      .catch(error => console.error('Error fetching subjects:', error));
      
    // Fetch existing exam results
    axios.get('http://localhost:7000/api/examresults/getAllExamResults')
      .then(response => setExamResults(response.data))
      .catch(error => console.error('Error fetching exam results:', error));
  }, [assignedClass, assignedSection]);

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

  const handleRemarkChange = (studentId, remark) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [studentId]: remark,
    }));
  };

  const calculateTotal = (studentId) => {
    const studentScores = scores[studentId] || {};
    const total = Object.entries(studentScores).reduce((sum, [subjectName, score]) => {
      return sum + (parseFloat(score) || 0);
    }, 0);
    return total;
  };

  const calculatePercentage = (studentId) => {
    const studentTotal = calculateTotal(studentId);
    const totalMarks = Object.values(subjectMarks).reduce((sum, marks) => sum + parseFloat(marks || 0), 0);
    return totalMarks > 0 ? ((studentTotal / totalMarks) * 100).toFixed(2) : '0.00';
  };

  const handleSubmit = () => {
    const resultData = {
      examName: selectedExam,
      className: assignedClass,
      sectionName: assignedSection,
      subjects: subjects.map(subject => ({
        subjectName: subject.subjectName,
        totalMarks: subjectMarks[subject.subjectName] || 0,
      })),
      students: students.map(student => ({
        studentId: student._id,
        rollNo: student.rollNo,
        studentName: `${student.firstName} ${student.lastName}`,
        scores: Object.keys(subjectMarks).map(subjectName => ({
          subjectName,
          score: scores[student._id]?.[subjectName] || 0,
        })),
        remark: remarks[student._id] || '', // Add remarks to result data
      })),
    };

    if (isEditing) {
      if (window.confirm('Are you sure you want to update this Exam detail?')) {
        axios.put(`http://localhost:7000/api/examresults/updateExamResult/${editingResultId}`, resultData)
          .then(() => {
            setExamResults(prevResults => prevResults.map(result =>
              result._id === editingResultId ? { ...result, ...resultData } : result
            ));
            setIsEditing(false);
            setEditingResultId('');
            resetFormFields(); // Reset form fields
            alert('Data is Updated');
          })
          .catch(error => console.error('Error updating exam result:', error));
      }
    } else {
      axios.post('http://localhost:7000/api/examresults/createExamResult', resultData)
        .then(response => {
          setExamResults(prevResults => [...prevResults, response.data]);
          resetFormFields(); // Reset form fields
          alert('Data is Added');
        })
        .catch(error => console.error('Error creating exam result:', error));
    }
  };

  const resetFormFields = () => {
    setSelectedExam('');
    setSubjects([]);
    setSubjectMarks({});
    setStudents([]);
    setScores({});
    setRemarks({});
    setIsEditing(false);
    setEditingResultId('');
  };

  const handleEdit = (resultId) => {
    const result = examResults.find(r => r._id === resultId);
    if (result) {
      setSelectedExam(result.examName);
      result.students.forEach(student => {
        setScores(prevScores => ({
          ...prevScores,
          [student.studentId]: student.scores.reduce((acc, score) => ({
            ...acc,
            [score.subjectName]: score.score,
          }), {}),
        }));
        setRemarks(prevRemarks => ({
          ...prevRemarks,
          [student.studentId]: student.remark || '',
        }));
      });
      setSubjectMarks(result.subjects.reduce((acc, subject) => ({
        ...acc,
        [subject.subjectName]: subject.totalMarks,
      }), {}));
      setIsEditing(true);
      setEditingResultId(resultId);
    }
  };

  const handleDelete = (resultId) => {
    if (window.confirm('Are you sure you want to delete this Exam detail?')) {
      axios.delete(`http://localhost:7000/api/examresults/deleteExamResult/${resultId}`)
        .then(() => {
          setExamResults(prevResults => prevResults.filter(result => result._id !== resultId));
        })
        .catch(error => console.error('Error deleting exam result:', error));
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Prepare Exam Results for {teacherClassIncharge}</h2>
      
      <div className="flex gap-4 mb-4">
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
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-4">Subjects with Total Marks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-4xl bg-white shadow-md rounded-lg mb-8">
            <thead className='bg-gray-200'>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm">Subject</th>
                <th className="py-2 px-4 border-b text-left text-sm">Total Marks</th>
              </tr>
            </thead>
            <tbody className='bg-gray-100'>
              {subjects.map(subject => (
                <tr key={subject._id}>
                  <td className="py-2 px-4 border-b text-sm">{subject.subjectName}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <input
                      type="number"
                      value={subjectMarks[subject.subjectName] || ''}
                      onChange={(e) => handleSubjectMarksChange(subject.subjectName, e.target.value)}
                      className="w-full border-gray-300 rounded-md text-sm p-1"
                      placeholder="Score"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Student Scores</h3>
      <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className='bg-gray-200'>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm">Sr No.</th>
                <th className="py-2 px-4 border-b text-left text-sm">Roll No</th>
                <th className="py-2 px-4 border-b text-left text-sm">Student Name</th>
                {subjects.map(subject => (
                  <th key={subject._id} className="py-2 px-4 border-b text-left text-sm">{subject.subjectName}</th>
                ))}
                <th className="py-2 px-4 border-b text-left text-sm">Total</th>
                <th className="py-2 px-4 border-b text-left text-sm">Percentage</th>
                <th className="py-2 px-4 border-b text-left text-sm">Remarks</th>
              </tr>
            </thead>
            <tbody className='bg-gray-100'>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td className="py-2 px-4 border-b text-sm">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-sm">{student.rollNo}</td>
                  <td className="py-2 px-4 border-b text-sm">{`${student.firstName} ${student.lastName}`}</td>
                  {subjects.map(subject => (
                    <td key={subject._id} className="py-2 px-4 border-b text-sm">
                      <input
                        type="number"
                        value={scores[student._id]?.[subject.subjectName] || ''}
                        onChange={(e) => handleScoreChange(student._id, subject.subjectName, e.target.value)}
                        className="w-full border-gray-300 rounded-md text-sm p-2"
                        placeholder="Score"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b text-sm">{calculateTotal(student._id)}</td>
                  <td className="py-2 px-4 border-b text-sm">{calculatePercentage(student._id)}%</td>
                  <td className="py-2 px-4 border-b text-sm">
                  <input
                      type="text"
                      value={remarks[student._id] || ''}
                      onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      <div className="flex justify-start my-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {isEditing ? 'Update Results' : 'Submit Results'}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Existing Results</h3>
      <ul className="list-disc list-inside">
        {examResults.map(result => (
          <li key={result._id} className="flex justify-between items-center mb-2 border-b py-2">
            <span>{result.examName} - {result.className} {result.sectionName}</span>
            <div>
              <button
                onClick={() => handleEdit(result._id)}
                className="text-green-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(result._id)}
                className="text-red-500 hover:underline ml-4"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrepareResult;
