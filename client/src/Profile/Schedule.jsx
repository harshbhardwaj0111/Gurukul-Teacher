import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherSchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const teacherName = 'Rinku Singh'; // Teacher name with space

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
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

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to extract and sort periods by time
  const getSortedPeriods = (day) => {
    let allPeriods = [];

    // Collect periods from each timetable
    schedule.forEach(timetable => {
      const periods = timetable.teacherSchedule[day].map(period => ({
        ...period,
        className: timetable.className,
        sectionName: timetable.sectionName,
        scheduleName: timetable.scheduleName
      }));
      allPeriods = [...allPeriods, ...periods];
    });

    // Sort periods based on startTime
    allPeriods.sort((a, b) => new Date(`1970-01-01T${a.startTime}`) - new Date(`1970-01-01T${b.startTime}`));

    return allPeriods;
  };

  // Collect all unique time ranges (start and end times) across all days and sort them
  const allTimeRanges = [
    ...new Set(
      schedule.flatMap(timetable =>
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          .flatMap(day => timetable.teacherSchedule[day].map(period => `${period.startTime}-${period.endTime}`))
      )
    )
  ].sort((a, b) => new Date(`1970-01-01T${a.split('-')[0]}`) - new Date(`1970-01-01T${b.split('-')[0]}`));

  // Helper function to render a row for each time range
  const renderRowForTimeRange = (timeRange, index) => {
    const [startTime, endTime] = timeRange.split('-'); // Split the time range into start and end time

    return (
      <tr key={timeRange}>
        <td className="border px-4 py-2">{index + 1}</td>
        <td className="border px-4 py-2">{`${startTime} - ${endTime}`}</td>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
          const periods = getSortedPeriods(day).filter(period => period.startTime === startTime && period.endTime === endTime);

          if (periods.length === 0) {
            return <td key={day} className="border px-4 py-2">No classes</td>;
          }

          return (
            <td key={day} className="border px-4 py-2">
              {periods.map((period, index) => (
                <div key={index} className="mb-2">
                  <p className="">{period.subject}</p> {/* Subject in bold */}
                  <p className="text-gray-500 text-sm">({period.className} - {period.sectionName})</p> {/* Class and section in light grey */}
                </div>
              ))}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Schedule - {teacherName}</h1>

      {schedule.length === 0 ? (
        <div>No schedule found for this teacher</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead className='bg-gray-200'>
            <tr>
              <th className="border px-4 py-2">Sr No.</th>
              <th className="border px-4 py-2">Timing</th>
              <th className="border px-4 py-2">Monday</th>
              <th className="border px-4 py-2">Tuesday</th>
              <th className="border px-4 py-2">Wednesday</th>
              <th className="border px-4 py-2">Thursday</th>
              <th className="border px-4 py-2">Friday</th>
              <th className="border px-4 py-2">Saturday</th>
            </tr>
          </thead>
          <tbody>
            {allTimeRanges.map((timeRange,index) => renderRowForTimeRange(timeRange,index))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherSchedulePage;
