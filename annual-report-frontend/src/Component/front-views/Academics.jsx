// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Doughnut, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title
// );

// const Academics = () => {
//   const [semesterWiseStudents, setSemesterWiseStudents] = useState({});
//   const [filterSession, setFilterSession] = useState('');
//   const [selectedDept, setSelectedDept] = useState('');
//   const [visibleSemester, setVisibleSemester] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [showPerformanceModal, setShowPerformanceModal] = useState(false);
//   const [toppers, setToppers] = useState([]);
//   const [slowLearners, setSlowLearners] = useState([]);

//   useEffect(() => {
//     if (filterSession && selectedDept) {
//       for (let i = 1; i <= 8; i++) {
//         fetchStudentsBySemester(i);
//       }
//     }
//   }, [filterSession, selectedDept]);

//   const fetchStudentsBySemester = async (sem) => {
//     if (!filterSession || !selectedDept) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:7070/students/semester/${sem}/session/${filterSession}?department=${encodeURIComponent(selectedDept)}`
//       );
//       setSemesterWiseStudents(prev => ({ ...prev, [sem]: res.data }));
//     } catch (err) {
//       console.error(`Error fetching semester ${sem}:`, err);
//       showMessage(`Failed to load semester ${sem} data`, false);
//     }
//   };

//   const calculateStudentPercentage = (student) => {
//     if (!student.subjects) return 0;
    
//     let totalMarks = 0;
//     let maxMarks = 0;
    
//     Object.values(student.subjects).forEach(subject => {
//       const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
//       totalMarks += subjectTotal;
//       maxMarks += 100;
//     });
    
//     return maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
//   };

//   const analyzePerformance = () => {
//     if (!filterSession || !selectedDept) {
//       showMessage('Please select both department and session first', false);
//       return;
//     }

//     const allStudents = [];
//     for (let sem = 1; sem <= 8; sem++) {
//       if (semesterWiseStudents[sem]) {
//         allStudents.push(...semesterWiseStudents[sem]);
//       }
//     }

//     if (allStudents.length === 0) {
//       showMessage('No students found for the selected criteria', false);
//       return;
//     }

//     const studentsWithPerformance = allStudents.map(student => {
//       let totalMarks = 0;
//       let maxMarks = 0;
//       let isFail = false;
      
//       if (student.subjects) {
//         Object.values(student.subjects).forEach(subject => {
//           const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
//           totalMarks += subjectTotal;
//           maxMarks += 100;
          
//           if (subjectTotal < 40) {
//             isFail = true;
//           }
//         });
//       }
      
//       const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
      
//       return {
//         ...student,
//         percentage,
//         isFail
//       };
//     });

//     const sortedByPercentage = [...studentsWithPerformance].sort((a, b) => b.percentage - a.percentage);
//     const top5 = sortedByPercentage.slice(0, 5);
//     const failedStudents = studentsWithPerformance.filter(student => student.isFail);
//     const sortedFailedStudents = [...failedStudents].sort((a, b) => a.percentage - b.percentage);
//     const last5Failed = sortedFailedStudents.slice(-5);

//     setToppers(top5);
//     setSlowLearners(last5Failed);
//     setShowPerformanceModal(true);
//   };

//   const prepareChartData = (students) => {
//     if (!students || students.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           data: [1],
//           backgroundColor: ['#CCCCCC'],
//         }]
//       };
//     }

//     let passed = 0;
//     let failed = 0;
//     students.forEach((s) => {
//       const isPass = s.subjects 
//         ? Object.values(s.subjects).every(subject => {
//             return subject.grade !== 'F';
//           })
//         : false;
//       isPass ? passed++ : failed++;
//     });

//     return {
//       labels: ['Passed', 'Failed'],
//       datasets: [{
//         data: [passed, failed],
//         backgroundColor: ['#4CAF50', '#FF6347'],
//         hoverOffset: 4,
//       }],
//     };
//   };

//   const prepareAnnualChartData = () => {
//     const years = [
//       { label: '1st Year', semesters: [1, 2] },
//       { label: '2nd Year', semesters: [3, 4] },
//       { label: '3rd Year', semesters: [5, 6] },
//       { label: '4th Year', semesters: [7, 8] }
//     ];

//     const labels = years.map(year => year.label);
//     const passedData = [];
//     const failedData = [];

//     years.forEach(year => {
//       let passed = 0;
//       let failed = 0;

//       year.semesters.forEach(sem => {
//         const students = semesterWiseStudents[sem] || [];
//         students.forEach(s => {
//           const isPass = s.subjects 
//             ? Object.values(s.subjects).every(subject => {
//                 return subject.grade !== 'F';
//               })
//             : false;
//           isPass ? passed++ : failed++;
//         });
//       });

//       passedData.push(passed);
//       failedData.push(failed);
//     });

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Passed',
//           data: passedData,
//           backgroundColor: '#4CAF50',
//         },
//         {
//           label: 'Failed',
//           data: failedData,
//           backgroundColor: '#FF6347',
//         }
//       ]
//     };
//   };

//   const showMessage = (msg, isSuccess) => {
//     setMessage({ text: msg, type: isSuccess ? 'success' : 'error' });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       </div>

//       {/* Header */}
//       <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
//         <div className="w-full px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="h-16 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
//                 <span className="text-blue-700 font-bold text-lg">AC</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-4xl font-bold text-white">
//                   Academics Department
//                 </h1>
//                 <p className="text-sm mt-1 text-blue-200">
//                   Cross-Department Academic Management
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button 
//                 onClick={() => window.history.back()}
//                 className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
//               >
//                 Back to Admin
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="pt-32 pb-20 px-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Toast Message */}
//           {message && (
//             <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
//               message.type === 'success' 
//                 ? 'bg-green-500/20 border-green-400/50 text-green-200' 
//                 : 'bg-red-500/20 border-red-400/50 text-red-200'
//             }`}>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
//                   <span>{message.text}</span>
//                 </div>
//                 <button onClick={() => setMessage(null)} className="text-lg hover:scale-110">×</button>
//               </div>
//             </div>
//           )}

//           {/* Performance Analysis Button */}
//           <div className="mb-8 text-center">
//             <button 
//               className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               onClick={analyzePerformance}
//             >
//               <i className="fas fa-chart-line mr-2"></i> View Top Performers & Slow Learners
//             </button>
//           </div>

//           {/* Filter Section */}
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
//             <h2 className="text-2xl font-bold text-white mb-6 text-center">Academic Filters</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Department Selection */}
//               <div>
//                 <h3 className="text-lg font-semibold text-white mb-4 text-center">Choose Department</h3>
//                 <select
//                   value={selectedDept}
//                   onChange={(e) => setSelectedDept(e.target.value)}
//                   className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                 >
//                   <option value="" className="text-gray-800">-- Select Department --</option>
//                   <option value="Computer Science" className="text-gray-800">Computer Science</option>
//                   <option value="Mechanical" className="text-gray-800">Mechanical Engineering</option>
//                   <option value="Electrical" className="text-gray-800">Electrical Engineering</option>
//                   <option value="Civil" className="text-gray-800">Civil Engineering</option>
//                 </select>
//               </div>

//               {/* Session Selection */}
//               <div>
//                 <h3 className="text-lg font-semibold text-white mb-4 text-center">Filter by Session</h3>
//                 <select
//                   value={filterSession}
//                   onChange={(e) => setFilterSession(e.target.value)}
//                   className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                 >
//                   <option value="" className="text-gray-800">-- Select Session --</option>
//                   <option value="2022-2023" className="text-gray-800">2022-2023</option>
//                   <option value="2023-2024" className="text-gray-800">2023-2024</option>
//                   <option value="2024-2025" className="text-gray-800">2024-2025</option>
//                   <option value="2025-2026" className="text-gray-800">2025-2026</option>
//                 </select>
//               </div>
//             </div>

//             {filterSession && selectedDept && (
//               <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-xl text-center">
//                 <p className="text-blue-200 font-semibold">
//                   Currently viewing: <strong className="text-white">{selectedDept}</strong> | <strong className="text-white">{filterSession}</strong>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Semester Navigation */}
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//             <h2 className="text-2xl font-bold text-white mb-6 text-center">Semester-wise Students</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
//               {[...Array(8)].map((_, i) => {
//                 const sem = i + 1;
//                 return (
//                   <button
//                     key={sem}
//                     onClick={() => {
//                       setVisibleSemester(sem);
//                       fetchStudentsBySemester(sem);
//                     }}
//                     className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
//                       visibleSemester === sem 
//                         ? 'bg-white text-blue-700 shadow-lg' 
//                         : 'bg-white/10 text-white hover:bg-white/20'
//                     }`}
//                   >
//                     Semester {sem}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Semester Details */}
//           {visibleSemester && (
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">
//                 Semester {visibleSemester} - Session: {filterSession} | Dept: {selectedDept}
//               </h3>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Student List */}
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Student List</h4>
//                   <div className="max-h-96 overflow-y-auto">
//                     {semesterWiseStudents[visibleSemester]?.length > 0 ? (
//                       <table className="w-full text-white">
//                         <thead>
//                           <tr className="border-b border-white/20">
//                             <th className="py-3 px-4 text-left">Name</th>
//                             <th className="py-3 px-4 text-left">Roll No</th>
//                             <th className="py-3 px-4 text-left">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {semesterWiseStudents[visibleSemester]?.map((s) => {
//                             const isPass = s.subjects 
//                               ? Object.values(s.subjects).every(subject => {
//                                   return subject.grade !== 'F';
//                                 })
//                               : false;
//                             return (
//                               <tr key={s.id} className="border-b border-white/10 hover:bg-white/5">
//                                 <td className="py-3 px-4">{s.name}</td>
//                                 <td className="py-3 px-4 font-mono">{s.rollNo}</td>
//                                 <td className={`py-3 px-4 font-semibold ${
//                                   isPass ? 'text-green-400' : 'text-red-400'
//                                 }`}>
//                                   {isPass ? 'Pass' : 'Fail'}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     ) : (
//                       <div className="text-center py-8 text-white/70">
//                         No students found for this semester and session.
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Performance Chart */}
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Semester Performance</h4>
//                   <div className="h-64 flex items-center justify-center">
//                     <Doughnut
//                       data={prepareChartData(semesterWiseStudents[visibleSemester])}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             position: 'bottom',
//                           },
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Annual Performance */}
//           {filterSession && selectedDept && (
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
//               <h2 className="text-2xl font-bold text-white mb-6 text-center">Annual Performance Overview</h2>
//               <div className="h-64">
//                 <Bar
//                   data={prepareAnnualChartData()}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: { position: 'top' },
//                       title: { display: true, text: 'Annual Pass/Fail Statistics' },
//                     },
//                     scales: {
//                       y: { beginAtZero: true }
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Performance Modal */}
//       {showPerformanceModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPerformanceModal(false)}>
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-white/20">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Performance Analysis - {selectedDept} | {filterSession}</h2>
//                 <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowPerformanceModal(false)}>
//                   &times;
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-8">
//               {/* Toppers Section */}
//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Top 5 Performers</h3>
//                 {toppers.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Rank</th>
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                         <th className="py-3 px-4 text-left">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {toppers.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4 font-bold">{index + 1}</td>
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-green-400">{student.percentage.toFixed(2)}%</td>
//                           <td className={`py-3 px-4 font-semibold ${
//                             student.isFail ? "text-red-400" : "text-green-400"
//                           }`}>
//                             {student.isFail ? "Fail" : "Pass"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
              
//               {/* Slow Learners Section */}
//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Students Needing Attention (Failed)</h3>
//                 {slowLearners.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                         <th className="py-3 px-4 text-left">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {slowLearners.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
//                           <td className="py-3 px-4 font-semibold text-red-400">Fail</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No failed students found</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Academics;













import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Academics = () => {
  const [semesterWiseStudents, setSemesterWiseStudents] = useState({});
  const [filterSession, setFilterSession] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [visibleSemester, setVisibleSemester] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [toppers, setToppers] = useState([]);
  const [slowLearners, setSlowLearners] = useState([]);

  useEffect(() => {
    if (filterSession && selectedDept) {
      for (let i = 1; i <= 8; i++) {
        fetchStudentsBySemester(i);
      }
    }
  }, [filterSession, selectedDept]);

  const fetchStudentsBySemester = async (sem) => {
    if (!filterSession || !selectedDept) return;
    try {
      const res = await axios.get(
        `http://localhost:7070/students/semester/${sem}/session/${filterSession}?department=${encodeURIComponent(selectedDept)}`
      );
      setSemesterWiseStudents(prev => ({ ...prev, [sem]: res.data }));
    } catch (err) {
      console.error(`Error fetching semester ${sem}:`, err);
      showMessage(`Failed to load semester ${sem} data`, false);
    }
  };

  const calculateStudentPercentage = (student) => {
    if (!student.subjects) return 0;
    
    let totalMarks = 0;
    let maxMarks = 0;
    
    Object.values(student.subjects).forEach(subject => {
      const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
      totalMarks += subjectTotal;
      maxMarks += 100;
    });
    
    return maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
  };

  const analyzePerformance = () => {
    if (!filterSession || !selectedDept) {
      showMessage('Please select both department and session first', false);
      return;
    }

    const allStudents = [];
    for (let sem = 1; sem <= 8; sem++) {
      if (semesterWiseStudents[sem]) {
        allStudents.push(...semesterWiseStudents[sem]);
      }
    }

    if (allStudents.length === 0) {
      showMessage('No students found for the selected criteria', false);
      return;
    }

    const studentsWithPerformance = allStudents.map(student => {
      let totalMarks = 0;
      let maxMarks = 0;
      let isFail = false;
      
      if (student.subjects) {
        Object.values(student.subjects).forEach(subject => {
          const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
          totalMarks += subjectTotal;
          maxMarks += 100;
          
          // Check if student failed in any subject (less than 40 marks)
          if (subjectTotal < 40) {
            isFail = true;
          }
        });
      }
      
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
      
      return {
        ...student,
        percentage,
        isFail
      };
    });

    // Get top 5 performers (highest percentage)
    const sortedByPercentage = [...studentsWithPerformance].sort((a, b) => b.percentage - a.percentage);
    const top5 = sortedByPercentage.slice(0, 5);

    // Get all failed students and sort by percentage (lowest first)
    const failedStudents = studentsWithPerformance.filter(student => student.isFail);
    const sortedFailedStudents = [...failedStudents].sort((a, b) => a.percentage - b.percentage);
    
    // Show all failed students (not just last 5)
    setToppers(top5);
    setSlowLearners(sortedFailedStudents); // Changed from last5Failed to sortedFailedStudents
    setShowPerformanceModal(true);
  };

  const prepareChartData = (students) => {
    if (!students || students.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#CCCCCC'],
        }]
      };
    }

    let passed = 0;
    let failed = 0;
    students.forEach((s) => {
      const isPass = s.subjects 
        ? Object.values(s.subjects).every(subject => {
            const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
            return subjectTotal >= 40; // Changed from grade check to marks check
          })
        : false;
      isPass ? passed++ : failed++;
    });

    return {
      labels: ['Passed', 'Failed'],
      datasets: [{
        data: [passed, failed],
        backgroundColor: ['#4CAF50', '#FF6347'],
        hoverOffset: 4,
      }],
    };
  };

  const prepareAnnualChartData = () => {
    const years = [
      { label: '1st Year', semesters: [1, 2] },
      { label: '2nd Year', semesters: [3, 4] },
      { label: '3rd Year', semesters: [5, 6] },
      { label: '4th Year', semesters: [7, 8] }
    ];

    const labels = years.map(year => year.label);
    const passedData = [];
    const failedData = [];

    years.forEach(year => {
      let passed = 0;
      let failed = 0;

      year.semesters.forEach(sem => {
        const students = semesterWiseStudents[sem] || [];
        students.forEach(s => {
          const isPass = s.subjects 
            ? Object.values(s.subjects).every(subject => {
                const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
                return subjectTotal >= 40; // Changed from grade check to marks check
              })
            : false;
          isPass ? passed++ : failed++;
        });
      });

      passedData.push(passed);
      failedData.push(failed);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Passed',
          data: passedData,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Failed',
          data: failedData,
          backgroundColor: '#FF6347',
        }
      ]
    };
  };

  const showMessage = (msg, isSuccess) => {
    setMessage({ text: msg, type: isSuccess ? 'success' : 'error' });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">AC</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  Academics Department
                </h1>
                <p className="text-sm mt-1 text-blue-200">
                  Cross-Department Academic Management
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.history.back()}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Toast Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-400/50 text-green-200' 
                : 'bg-red-500/20 border-red-400/50 text-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
                  <span>{message.text}</span>
                </div>
                <button onClick={() => setMessage(null)} className="text-lg hover:scale-110">×</button>
              </div>
            </div>
          )}

          {/* Performance Analysis Button */}
          <div className="mb-8 text-center">
            <button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={analyzePerformance}
            >
              <i className="fas fa-chart-line mr-2"></i> View Top Performers & Failed Students
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Academic Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Department Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Choose Department</h3>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="" className="text-gray-800">-- Select Department --</option>
                  <option value="Computer Science" className="text-gray-800">Computer Science</option>
                  <option value="Mechanical" className="text-gray-800">Mechanical Engineering</option>
                  <option value="Electrical" className="text-gray-800">Electrical Engineering</option>
                  <option value="Civil" className="text-gray-800">Civil Engineering</option>
                </select>
              </div>

              {/* Session Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Filter by Session</h3>
                <select
                  value={filterSession}
                  onChange={(e) => setFilterSession(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="" className="text-gray-800">-- Select Session --</option>
                  <option value="2022-2023" className="text-gray-800">2022-2023</option>
                  <option value="2023-2024" className="text-gray-800">2023-2024</option>
                  <option value="2024-2025" className="text-gray-800">2024-2025</option>
                  <option value="2025-2026" className="text-gray-800">2025-2026</option>
                </select>
              </div>
            </div>

            {filterSession && selectedDept && (
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-xl text-center">
                <p className="text-blue-200 font-semibold">
                  Currently viewing: <strong className="text-white">{selectedDept}</strong> | <strong className="text-white">{filterSession}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Semester Navigation */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Semester-wise Students</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {[...Array(8)].map((_, i) => {
                const sem = i + 1;
                return (
                  <button
                    key={sem}
                    onClick={() => {
                      setVisibleSemester(sem);
                      fetchStudentsBySemester(sem);
                    }}
                    className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                      visibleSemester === sem 
                        ? 'bg-white text-blue-700 shadow-lg' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Semester {sem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Semester Details */}
          {visibleSemester && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Semester {visibleSemester} - Session: {filterSession} | Dept: {selectedDept}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student List */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-4">Student List</h4>
                  <div className="max-h-96 overflow-y-auto">
                    {semesterWiseStudents[visibleSemester]?.length > 0 ? (
                      <table className="w-full text-white">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Roll No</th>
                            <th className="py-3 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semesterWiseStudents[visibleSemester]?.map((s) => {
                            const isPass = s.subjects 
                              ? Object.values(s.subjects).every(subject => {
                                  const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.training || 0) + (subject.final || 0);
                                  return subjectTotal >= 40;
                                })
                              : false;
                            return (
                              <tr key={s.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="py-3 px-4">{s.name}</td>
                                <td className="py-3 px-4 font-mono">{s.rollNo}</td>
                                <td className={`py-3 px-4 font-semibold ${
                                  isPass ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {isPass ? 'Pass' : 'Fail'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-white/70">
                        No students found for this semester and session.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Performance Chart */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-4">Semester Performance</h4>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut
                      data={prepareChartData(semesterWiseStudents[visibleSemester])}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Annual Performance */}
          {filterSession && selectedDept && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Annual Performance Overview</h2>
              <div className="h-64">
                <Bar
                  data={prepareAnnualChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Annual Pass/Fail Statistics' },
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Modal */}
      {showPerformanceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPerformanceModal(false)}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Performance Analysis - {selectedDept} | {filterSession}</h2>
                <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowPerformanceModal(false)}>
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Toppers Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Top 5 Performers</h3>
                {toppers.length > 0 ? (
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4 text-left">Rank</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Roll No</th>
                        <th className="py-3 px-4 text-left">Semester</th>
                        <th className="py-3 px-4 text-left">Percentage</th>
                        <th className="py-3 px-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toppers.map((student, index) => (
                        <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 font-bold">{index + 1}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                          <td className="py-3 px-4">Semester {student.semester}</td>
                          <td className="py-3 px-4 font-bold text-green-400">{student.percentage.toFixed(2)}%</td>
                          <td className={`py-3 px-4 font-semibold ${
                            student.isFail ? "text-red-400" : "text-green-400"
                          }`}>
                            {student.isFail ? "Fail" : "Pass"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-white/70">No data available</div>
                )}
              </div>
              
              {/* Failed Students Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Failed Students ({slowLearners.length} Students)
                </h3>
                {slowLearners.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Roll No</th>
                          <th className="py-3 px-4 text-left">Semester</th>
                          <th className="py-3 px-4 text-left">Percentage</th>
                          <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slowLearners.map((student, index) => (
                          <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                            <td className="py-3 px-4">Semester {student.semester}</td>
                            <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
                            <td className="py-3 px-4 font-semibold text-red-400">Fail</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/70">
                    <div className="text-4xl mb-2">🎉</div>
                    <p>No failed students found!</p>
                    <p className="text-sm mt-2 text-green-300">All students have passed!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;