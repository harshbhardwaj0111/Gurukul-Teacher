import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function ClassReport() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterFinancial, setFilterFinancial] = useState('');
    const [teacherClass, setTeacherClass] = useState('');
    const [message, setMessage] = useState('');
    const [teacherSection, setTeacherSection] = useState('');

    useEffect(() => {
        // Fetch the teacher's assigned class and section
        async function fetchTeacherData() {
            try {
                const response = await axios.get(`http://localhost:7000/api/teachers/getTeacherById/66f12d8a8f27884ade9f1349`);
                const teacherData = response.data;
    
                if (teacherData.classIncharge) {
                    const [className, sectionName] = teacherData.classIncharge.split(' (');
                    setTeacherClass(className);
                    setTeacherSection(sectionName.replace(')', ''));
                } else {
                    setMessage('You are not in charge of any class.');
                }
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        }
    
        fetchTeacherData();
    }, []); // This useEffect only fetches the teacher data on initial render
    
    useEffect(() => {
        if (teacherClass && teacherSection) {
            // Fetch students only when teacherClass and teacherSection are set
            async function fetchStudents() {
                try {
                    const studentsResponse = await axios.get('http://localhost:7000/api/students/getStudents');
                    const activeStudents = studentsResponse.data.filter(student =>
                        student.status === 'active' &&
                        student.class === teacherClass &&
                        student.section === teacherSection
                    );
    
                    setStudents(activeStudents);
                    setFilteredStudents(activeStudents);
                } catch (error) {
                    console.error('Error fetching student data:', error);
                }
            }
    
            fetchStudents();
        }
    }, [teacherClass, teacherSection]); // This useEffect depends on teacherClass and teacherSection    

    const handleSearch = () => {
        let tempStudents = students.filter(student => student.status === 'active');

        if (searchTerm) {
            tempStudents = tempStudents.filter(student =>
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollNo.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory) {
            tempStudents = tempStudents.filter(student => student.category === filterCategory);
        }

        if (filterFinancial) {
            tempStudents = tempStudents.filter(student => student.financial === filterFinancial);
        }

        if (filterGender) {
            tempStudents = tempStudents.filter(student => student.gender === filterGender);
        }

        setFilteredStudents(tempStudents);
    };

    const exportToExcel = () => {
        const worksheetData = filteredStudents.map((student, index) => ({
            'Sr No.': index + 1,
            'Roll Number': student.rollNo,
            'Student Name': `${student.firstName} ${student.lastName}`,
            "Father's Name": student.fatherName,
            Class: `${student.class} (${student.section})`,
            ...(filterCategory ? { Category: student.category } : {}),
            ...(filterGender ? { Gender: student.gender } : {}),
            ...(filterFinancial ? { 'Financial Status': student.financial } : {}),
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');
        XLSX.writeFile(workbook, 'TeacherClassReport.xlsx');
    };

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
                        Class Report: {teacherClass} ({teacherSection})
                    </h1>
                </header>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by Name or Roll Number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">Filter by Category</option>
                            <option value="General">General</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="OBC">OBC</option>
                            <option value="Minority">Minority</option>
                            <option value="Any Other">Any Other</option>
                        </select>
                        <select
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">Filter by Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                        <select
                            value={filterFinancial}
                            onChange={(e) => setFilterFinancial(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">Filter by Financial Status</option>
                            <option value="apl">Above Poverty Line (APL)</option>
                            <option value="bpl">Below Poverty Line (BPL)</option>
                            <option value="ews">Economically Weaker Sections (EWS)</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full md:w-auto"
                        >
                            <i className="fas fa-search mr-2"></i>Search
                        </button>
                    </div>

                    <div className="flex justify-start items-center bg-blue-50 text-blue-700 p-4 rounded mb-4">
                        <i className="fas fa-users text-2xl mr-2"></i>
                        <p className="text-lg font-semibold">Total Students: {filteredStudents.length}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 text-sm md:text-base">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-300">Sr No.</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Roll Number</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Student Name</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Father's Name</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Class</th>
                                    {filterCategory && <th className="py-2 px-4 border-b border-gray-300">Category</th>}
                                    {filterGender && <th className="py-2 px-4 border-b border-gray-300">Gender</th>}
                                    {filterFinancial && <th className="py-2 px-4 border-b border-gray-300">Financial Status</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student._id} className="text-center">
                                        <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{student.rollNo}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{student.firstName} {student.lastName}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{student.fatherName}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{student.class} ({student.section})</td>
                                        {filterCategory && <td className="py-2 px-4 border-b border-gray-300">{student.category}</td>}
                                        {filterGender && <td className="py-2 px-4 border-b border-gray-300">{student.gender}</td>}
                                        {filterFinancial && <td className="py-2 px-4 border-b border-gray-300">{student.financial}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end my-4">
                        <button
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            <i className="fas fa-file-excel mr-2"></i>Export to Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassReport;
