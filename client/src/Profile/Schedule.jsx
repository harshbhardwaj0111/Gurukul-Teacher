import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherSchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Teacher name with space
 const teacherName = 'Rinku Singh'; 

 // Fetch the schedule on component mount
 useEffect(() => {
   const fetchSchedule = async () => {
     try {
       // Encode the teacher name for the URL
       const encodedName = encodeURIComponent(teacherName);
       const response = await axios.get(`http://localhost:7000/api/timetable/getTeacherSchedule/${encodedName}`);
       setSchedule(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        setError('Failed to fetch schedule');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Display loading state
  if (loading) {
    return <div>Loading schedule...</div>;
  }

  // Display error state
  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to render the periods for each day
  const renderPeriodsForDay = (day, periods) => {
    if (periods.length === 0) {
      return <td className="border px-4 py-2 text-center">No classes</td>;
    }

    return (
      <td className="border px-4 py-2">
        {periods.map((period, index) => (
          <div key={index}>
            <p>{`${period.startTime} - ${period.endTime}`}</p>
            <p>{period.subject}</p>
            <p>{period.roomNo}</p>
          </div>
        ))}
      </td>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Schedule - Vicky Singh</h1>

      {schedule.length === 0 ? (
        <div>No schedule found for this teacher</div>
      ) : (
        schedule.map((timetable, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {timetable.className} - {timetable.sectionName}
            </h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Monday</th>
                  <th className="border px-4 py-2">Tuesday</th>
                  <th className="border px-4 py-2">Wednesday</th>
                  <th className="border px-4 py-2">Thursday</th>
                  <th className="border px-4 py-2">Friday</th>
                  <th className="border px-4 py-2">Saturday</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {renderPeriodsForDay('Monday', timetable.teacherSchedule.Monday)}
                  {renderPeriodsForDay('Tuesday', timetable.teacherSchedule.Tuesday)}
                  {renderPeriodsForDay('Wednesday', timetable.teacherSchedule.Wednesday)}
                  {renderPeriodsForDay('Thursday', timetable.teacherSchedule.Thursday)}
                  {renderPeriodsForDay('Friday', timetable.teacherSchedule.Friday)}
                  {renderPeriodsForDay('Saturday', timetable.teacherSchedule.Saturday)}
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherSchedulePage;
