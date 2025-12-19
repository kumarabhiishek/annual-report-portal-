// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Doughnut, Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement
// );
// const ComputerScience = () => {
//   const [students, setStudents] = useState([]);
//   const [semesterWiseStudents, setSemesterWiseStudents] = useState({});
//   const [formData, setFormData] = useState({
//     name: '',
//     rollNo: '',
//     semester: '',
//     session: '',
//     training: '',
//     grades: {}
//   });
//   const [filterSession, setFilterSession] = useState('');
//   const [visibleSemester, setVisibleSemester] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showPerformanceModal, setShowPerformanceModal] = useState(false);
//   const [toppers, setToppers] = useState([]);
//   const [slowLearners, setSlowLearners] = useState([]);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [comprehensiveReport, setComprehensiveReport] = useState(null);
  
//   const reportRef = useRef();

//   const subjects = {
//     1: ['BT-101 - Engineering Chemistry', 'BT-102 - Mathematics-I', 'BT-104 - Basic Electrical & Electronics Engineering','BT-103 - English for Communication', 'BT-105 - Engineering Graphics'],
//     2: ['BT-201 - Engineering Physics', 'BT-202 - Mathematics-II', 'BT-203 - Basic Mechanical Engineering', 'BT-204 - Basic Civil Engineering & Mechanics','BT-205 - Basic Computer Engineering'],
//     3: ['ES-301 - Energy & Environmental Engineering', 'CS-302 - Discrete Structure', 'CS-303 - Data Structure', 'CS-304 - Digital Systems','CS-305 - Object Oriented Programming & Methodology'],
//     4: ['BT-401 - Mathematics- III', 'CS-402 - Analysis Design of Algorithm', 'CS-403 - Software Engineering', 'CS-404 - Computer Org. & Architecture','CS-405 - Operating Systems'],
//     5: ['CS-501 - Theory of Computation', 'CS-502 - Database Management Systems', 'CS-503 - Pattern Recognition', 'CS-504 - Internet and Web Technology'],
//     6: ['CS-603 - Compiler Design', 'CS-601 - Machine Learning', 'CS-604 - Project Management', 'CS-602 - Computer Networks'],
//     7: ['CS-701 - Artificial Intelligence', 'CS-702 - Cloud Computing', 'CS-703 - Cyber Security', 'CS-704 - Big Data Analytics'],
//     8: ['CS-801 - Internet of Things', 'CS-802 - Blockchain Technology', 'CS-803 - Project Work', 'CS-804 - Seminar'],
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     if (filterSession) {
//       for (let i = 1; i <= 8; i++) {
//         fetchStudentsBySemester(i);
//       }
//     }
//   }, [filterSession]);

//   const fetchStudents = async () => {
//     try {
//       const res = await axios.get('http://localhost:7070/students');
//       setStudents(res.data);
//     } catch (err) {
//       console.error('Error fetching students:', err);
//       showMessage('Failed to load students data', false);
//     }
//   };

//   const fetchStudentsBySemester = async (sem) => {
//     if (!filterSession) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:7070/students/semester/${sem}/session/${filterSession}`
//       );
//       setSemesterWiseStudents(prev => ({ ...prev, [sem]: res.data }));
//     } catch (err) {
//       console.error(`Error fetching semester ${sem}:`, err);
//       showMessage(`Failed to load semester ${sem} data`, false);
//     }
//   };

//   const calculateStudentPercentage = (student) => {
//     if (!student.subjects || student.subjects.length === 0) return 0;
    
//     let totalMarks = 0;
//     let maxMarks = 0;
    
//     student.subjects.forEach(subject => {
//       const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//       totalMarks += subjectTotal;
//       maxMarks += 80;
//     });
    
//     totalMarks += parseInt(student.training) || 0;
//     maxMarks += 100;
    
//     return maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
//   };

//   const analyzePerformance = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const allStudents = [];
//     for (let sem = 1; sem <= 8; sem++) {
//       if (semesterWiseStudents[sem]) {
//         allStudents.push(...semesterWiseStudents[sem]);
//       }
//     }

//     if (allStudents.length === 0) {
//       showMessage('No students found for the selected session', false);
//       return;
//     }

//     const studentsWithPercentage = allStudents.map(student => ({
//       ...student,
//       percentage: calculateStudentPercentage(student)
//     }));

//     const sortedStudents = [...studentsWithPercentage].sort((a, b) => b.percentage - a.percentage);
//     const top5 = sortedStudents.slice(0, 5);
//     const last5 = sortedStudents.slice(-5);

//     setToppers(top5);
//     setSlowLearners(last5);
//     setShowPerformanceModal(true);
//   };

//   const generateComprehensiveReport = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const report = {
//       session: filterSession,
//       generatedAt: new Date().toLocaleString(),
//       semesterWise: {},
//       annualSummary: {},
//       topPerformers: [],
//       slowLearners: [],
//       semesterChartData: prepareSemesterChartDataForReport(),
//       annualChartData: prepareAnnualChartDataForReport(),
//       trendChartData: prepareTrendChartDataForReport()
//     };

//     for (let sem = 1; sem <= 8; sem++) {
//       const students = semesterWiseStudents[sem] || [];
//       let passed = 0;
//       let failed = 0;
//       let totalPercentage = 0;
//       const semesterToppers = [];

//       students.forEach(student => {
//         const percentage = calculateStudentPercentage(student);
//         totalPercentage += percentage;
        
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         isPass ? passed++ : failed++;
        
//         semesterToppers.push({
//           name: student.name,
//           rollNo: student.rollNo,
//           percentage: percentage
//         });
//       });

//       semesterToppers.sort((a, b) => b.percentage - a.percentage);
//       const top3 = semesterToppers.slice(0, 3);

//       report.semesterWise[sem] = {
//         totalStudents: students.length,
//         passed,
//         failed,
//         passPercentage: students.length > 0 ? ((passed / students.length) * 100).toFixed(2) : 0,
//         averagePercentage: students.length > 0 ? (totalPercentage / students.length).toFixed(2) : 0,
//         topPerformers: top3
//       };
//     }

//     const years = [
//       { label: '1st Year', semesters: [1, 2] },
//       { label: '2nd Year', semesters: [3, 4] },
//       { label: '3rd Year', semesters: [5, 6] },
//       { label: '4th Year', semesters: [7, 8] }
//     ];

//     years.forEach(year => {
//       let totalStudents = 0;
//       let totalPassed = 0;
//       let totalPercentage = 0;

//       year.semesters.forEach(sem => {
//         const students = semesterWiseStudents[sem] || [];
//         totalStudents += students.length;
        
//         students.forEach(student => {
//           const percentage = calculateStudentPercentage(student);
//           totalPercentage += percentage;
          
//           const isPass = student.subjects && student.subjects.length > 0
//             ? student.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
//               }) 
//             : false;
          
//           if (isPass) totalPassed++;
//         });
//       });

//       report.annualSummary[year.label] = {
//         totalStudents,
//         totalPassed,
//         totalFailed: totalStudents - totalPassed,
//         passPercentage: totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(2) : 0,
//         averagePercentage: totalStudents > 0 ? (totalPercentage / totalStudents).toFixed(2) : 0
//       };
//     });

//     const allStudents = [];
//     for (let sem = 1; sem <= 8; sem++) {
//       if (semesterWiseStudents[sem]) {
//         semesterWiseStudents[sem].forEach(student => {
//           allStudents.push({
//             ...student,
//             percentage: calculateStudentPercentage(student)
//           });
//         });
//       }
//     }

//     allStudents.sort((a, b) => b.percentage - a.percentage);
//     report.topPerformers = allStudents.slice(0, 10);
//     report.slowLearners = allStudents.slice(-10);

//     setComprehensiveReport(report);
//     setShowReportModal(true);
//   };

//   const prepareSemesterChartDataForReport = () => {
//     const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
//     const passData = [];
//     const failData = [];

//     semesters.forEach(sem => {
//       const students = semesterWiseStudents[sem] || [];
//       let passed = 0;
//       let failed = 0;

//       students.forEach(s => {
//         const isPass = s.subjects && s.subjects.length > 0
//           ? s.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
//         isPass ? passed++ : failed++;
//       });

//       passData.push(passed);
//       failData.push(failed);
//     });

//     return {
//       labels: semesters.map(sem => `Sem ${sem}`),
//       datasets: [
//         {
//           label: 'Passed',
//           data: passData,
//           backgroundColor: '#4CAF50',
//         },
//         {
//           label: 'Failed',
//           data: failData,
//           backgroundColor: '#FF6347',
//         }
//       ]
//     };
//   };

//   const prepareAnnualChartDataForReport = () => {
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
//           const isPass = s.subjects && s.subjects.length > 0
//             ? s.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
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

//   const prepareTrendChartDataForReport = () => {
//     const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
//     const passPercentages = [];
//     const averagePercentages = [];

//     semesters.forEach(sem => {
//       const students = semesterWiseStudents[sem] || [];
//       let totalPercentage = 0;
//       let passed = 0;

//       students.forEach(student => {
//         const percentage = calculateStudentPercentage(student);
//         totalPercentage += percentage;
        
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         if (isPass) passed++;
//       });

//       const passPercentage = students.length > 0 ? ((passed / students.length) * 100) : 0;
//       const averagePercentage = students.length > 0 ? (totalPercentage / students.length) : 0;

//       passPercentages.push(passPercentage);
//       averagePercentages.push(averagePercentage);
//     });

//     return {
//       labels: semesters.map(sem => `Sem ${sem}`),
//       datasets: [
//         {
//           label: 'Pass Percentage',
//           data: passPercentages,
//           borderColor: '#4CAF50',
//           backgroundColor: 'rgba(76, 175, 80, 0.1)',
//           fill: true,
//           tension: 0.4
//         },
//         {
//           label: 'Average Percentage',
//           data: averagePercentages,
//           borderColor: '#2196F3',
//           backgroundColor: 'rgba(33, 150, 243, 0.1)',
//           fill: true,
//           tension: 0.4
//         }
//       ]
//     };
//   };

//   const downloadReportAsImage = async () => {
//     if (!comprehensiveReport) return;
    
//     try {
//       const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners } = comprehensiveReport;
      
//       let csvContent = "Academic Performance Report\n";
//       csvContent += `Session: ${session}, Generated: ${generatedAt}\n\n`;
      
//       csvContent += "SEMESTER-WISE PERFORMANCE\n";
//       csvContent += "Semester,Total Students,Passed,Failed,Pass %,Average %\n";
//       for (let sem = 1; sem <= 8; sem++) {
//         const data = semesterWise[sem] || {};
//         csvContent += `${sem},${data.totalStudents || 0},${data.passed || 0},${data.failed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
//       }
      
//       csvContent += "\nANNUAL SUMMARY\n";
//       csvContent += "Year,Total Students,Passed,Failed,Pass %,Average %\n";
//       ['1st Year', '2nd Year', '3rd Year', '4th Year'].forEach(year => {
//         const data = annualSummary[year] || {};
//         csvContent += `${year},${data.totalStudents || 0},${data.totalPassed || 0},${data.totalFailed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
//       });
      
//       csvContent += "\nTOP 10 PERFORMERS\n";
//       csvContent += "Rank,Name,Roll No,Semester,Percentage\n";
//       topPerformers.forEach((student, index) => {
//         csvContent += `${index + 1},${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
//       });
      
//       csvContent += "\nSTUDENTS NEEDING ATTENTION\n";
//       csvContent += "Name,Roll No,Semester,Percentage\n";
//       slowLearners.forEach(student => {
//         csvContent += `${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
//       });
      
//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `Academic_Report_${comprehensiveReport.session}.csv`;
//       link.click();
//       URL.revokeObjectURL(url);
      
//       showMessage('Report data downloaded as CSV!', true);
//     } catch (error) {
//       console.error('Error generating data:', error);
//       showMessage('Failed to download report data', false);
//     }
//   };

// const printReport = () => {
//   if (!comprehensiveReport) return;
  
//   const printWindow = window.open('', '_blank');
//   const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners } = comprehensiveReport;
  
//   const chartsContainer = document.querySelector('.bg-white\\/5.rounded-2xl.p-6.border.border-white\\/10');
//   let chartImages = '';
  
//   if (chartsContainer) {
//     const chartElements = chartsContainer.querySelectorAll('canvas');
//     chartElements.forEach((chart, index) => {
//       const chartImage = chart.toDataURL('image/png');
//       const chartTitles = [
//         'Semester-wise Pass/Fail Distribution',
//         'Performance Trend Across Semesters', 
//         'Annual Performance Summary'
//       ];
//       chartImages += `
//         <div class="chart-container" style="page-break-inside: avoid; margin: 20px 0; text-align: center;">
//           <div class="chart-title" style="font-weight: bold; margin-bottom: 10px; font-size: 16px;">${chartTitles[index]}</div>
//           <img src="${chartImage}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" />
//         </div>
//       `;
//     });
//   }
  
//   printWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Academic Report - ${comprehensiveReport.session}</title>
//         <style>
//           body { 
//             font-family: 'Arial', sans-serif;
//             background: white;
//             color: black;
//             padding: 20px;
//             line-height: 1.6;
//             margin: 0;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .header {
//             text-align: center;
//             border-bottom: 3px solid #1e3a8a;
//             padding-bottom: 20px;
//             margin-bottom: 30px;
//           }
//           .section {
//             margin-bottom: 30px;
//             page-break-inside: avoid;
//           }
//           .section-title {
//             background: #1e3a8a;
//             color: white;
//             padding: 10px;
//             margin-bottom: 15px;
//             border-radius: 5px;
//           }
//           .stats-grid {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 10px;
//             margin-bottom: 20px;
//           }
//           .stat-card {
//             border: 1px solid #ddd;
//             padding: 10px;
//             border-radius: 5px;
//             text-align: center;
//             background: white;
//           }
//           .chart-container {
//             text-align: center;
//             margin: 20px 0;
//             page-break-inside: avoid;
//           }
//           .chart-title {
//             font-weight: bold;
//             margin-bottom: 10px;
//             font-size: 16px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//             background: white;
//           }
//           th, td {
//             border: 1px solid #ddd;
//             padding: 8px;
//             text-align: left;
//           }
//           th {
//             background-color: #f8f9fa;
//             font-weight: bold;
//           }
//           .passed { color: #28a745; font-weight: bold; }
//           .failed { color: #dc3545; font-weight: bold; }
//           .top-performer { color: #28a745; }
//           .slow-learner { color: #dc3545; }
//           @media print {
//             body { 
//               margin: 0;
//               padding: 15px;
//               background: white !important;
//               color: black !important;
//             }
//             .header {
//               background: white !important;
//               color: black !important;
//             }
//             .section { 
//               page-break-inside: avoid;
//               background: white !important;
//             }
//             .section-title {
//               background: #1e3a8a !important;
//               color: white !important;
//               -webkit-print-color-adjust: exact;
//               print-color-adjust: exact;
//             }
//             .stat-card {
//               background: white !important;
//               border: 1px solid #000 !important;
//             }
//             .chart-container { 
//               page-break-inside: avoid;
//               background: white !important;
//             }
//             table {
//               background: white !important;
//             }
//             @page {
//               margin: 0.5in;
//               size: portrait;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1 style="color: #1e3a8a; margin-bottom: 5px; font-size: 28px;">Department of Computer Science</h1>
//           <h2 style="color: #3730a3; margin-top: 0; font-size: 22px;">Academic Performance Report</h2>
//           <div style="display: flex; justify-content: center; gap: 30px; margin-top: 15px; font-size: 14px;">
//             <div><strong>Session:</strong> ${session}</div>
//             <div><strong>Generated On:</strong> ${generatedAt}</div>
//             <div><strong>Total Students:</strong> ${Object.values(semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}</div>
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Performance Charts</div>
//           ${chartImages || `
//             <div class="chart-container">
//               <div class="chart-title">Semester-wise Pass/Fail Distribution</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//             <div class="chart-container">
//               <div class="chart-title">Performance Trend Across Semesters</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//             <div class="chart-container">
//               <div class="chart-title">Annual Performance Summary</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//           `}
//         </div>

//         <div class="section">
//           <div class="section-title">Semester-wise Performance</div>
//           <div class="stats-grid">
//             ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
//               const data = semesterWise[sem] || {};
//               return `
//                 <div class="stat-card">
//                   <strong>Semester ${sem}</strong><br>
//                   Total: ${data.totalStudents || 0}<br>
//                   <span class="passed">Passed: ${data.passed || 0}</span><br>
//                   <span class="failed">Failed: ${data.failed || 0}</span><br>
//                   Pass %: ${data.passPercentage || 0}%<br>
//                   Avg %: ${data.averagePercentage || 0}%
//                 </div>
//               `;
//             }).join('')}
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Annual Summary</div>
//           <div class="stats-grid">
//             ${['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => {
//               const data = annualSummary[year] || {};
//               return `
//                 <div class="stat-card">
//                   <strong>${year}</strong><br>
//                   Total: ${data.totalStudents || 0}<br>
//                   <span class="passed">Passed: ${data.totalPassed || 0}</span><br>
//                   <span class="failed">Failed: ${data.totalFailed || 0}</span><br>
//                   Pass %: ${data.passPercentage || 0}%<br>
//                   Avg %: ${data.averagePercentage || 0}%
//                 </div>
//               `;
//             }).join('')}
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Top 10 Performers (Overall)</div>
//           ${topPerformers.length > 0 ? `
//             <table>
//               <thead>
//                 <tr>
//                   <th>Rank</th>
//                   <th>Name</th>
//                   <th>Roll No</th>
//                   <th>Semester</th>
//                   <th>Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${topPerformers.map((student, index) => `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td>${student.name}</td>
//                     <td>${student.rollNo}</td>
//                     <td>Semester ${student.semester}</td>
//                     <td class="top-performer">${student.percentage.toFixed(2)}%</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           ` : '<p>No data available</p>'}
//         </div>

//         <div class="section">
//           <div class="section-title">Slow Learner</div>
//           ${slowLearners.length > 0 ? `
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Roll No</th>
//                   <th>Semester</th>
//                   <th>Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${slowLearners.map(student => `
//                   <tr>
//                     <td>${student.name}</td>
//                     <td>${student.rollNo}</td>
//                     <td>Semester ${student.semester}</td>
//                     <td class="slow-learner">${student.percentage.toFixed(2)}%</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           ` : '<p>No data available</p>'}
//         </div>

//         <script>
//           setTimeout(() => {
//             window.print();
//             setTimeout(() => {
//               window.close();
//             }, 100);
//           }, 500);
//         </script>
//       </body>
//     </html>
//   `);
//   printWindow.document.close();
// };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     setIsAdding(true);
    
//     const subjectsArray = Object.entries(formData.grades).map(([subjectName, marks]) => ({
//       subjectName: subjectName,
//       mid1: marks.mid1 || 0,
//       mid2: marks.mid2 || 0,
//       assignment: marks.assignment || 0
//     }));

//     const newStudent = {
//       name: formData.name,
//       rollNo: formData.rollNo,
//       semester: parseInt(formData.semester),
//       session: formData.session,
//       training: parseInt(formData.training) || 0,
//       subjects: subjectsArray
//     };

//     try {
//       await axios.post('http://localhost:7070/students', newStudent);
//       setFilterSession(formData.session);
//       setFormData({
//         name: '',
//         rollNo: '',
//         semester: '',
//         session: '',
//         training: '',
//         grades: {}
//       });
//       showMessage('Student added successfully!', true);
//     } catch (err) {
//       console.error('Error adding student:', err);
//       showMessage('Failed to add student. Please check the form.', false);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleDeleteStudent = async (id, semester) => {
//     try {
//       await axios.delete(`http://localhost:7070/students/${id}`);
//       await fetchStudentsBySemester(semester);
//       showMessage('Student deleted successfully!', true);
//     } catch (err) {
//       console.error('Error deleting student:', err);
//       showMessage('Error deleting student!', false);
//     }
//   };

//   const handleCSVUpload = async (file) => {
//     if (!file) {
//       showMessage('Please select a file first!', false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     setIsUploading(true);

//     try {
//       const response = await axios.post(
//         'http://localhost:7070/students/upload', 
//         formData, 
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           timeout: 10000
//         }
//       );

//       if (response.data.success) {
//         const uploadedSession = response.data.session;
//         setFilterSession(uploadedSession);
//         showMessage(
//           `CSV uploaded successfully! ${response.data.count} students added. Session: ${uploadedSession}`,
//           true
//         );
        
//         for (let i = 1; i <= 8; i++) {
//           await fetchStudentsBySemester(i);
//         }
//         setVisibleSemester(1);
//       }
//     } catch (error) {
//       console.error('Upload failed:', error);
//       const errorMsg = error.response?.data?.message || 
//                       error.message || 
//                       'Failed to upload CSV. Please check the file format.';
//       showMessage(errorMsg, false);
//     } finally {
//       setIsUploading(false);
//       setSelectedFile(null);
//     }
//   };

// const downloadTemplate = (sem) => {
//   const headers = ['name', 'rollNo', 'semester', 'session', 'training'];
  
//   // Use simple subject names without codes for CSV headers
//   subjects[sem].forEach(sub => {
//     // Extract just the subject name without code (e.g., "Mathematics" from "BT-101 - Engineering Mathematics")
//     const subjectName = sub.split(' - ')[1] || sub;
//     headers.push(`${subjectName}.mid1`);
//     headers.push(`${subjectName}.mid2`);
//     headers.push(`${subjectName}.assignment`);
//   });
  
//   const sampleData = [
//     'shubham  raj', 
//     `CS${new Date().getFullYear()}${sem.toString().padStart(3, '0')}`, 
//     sem, 
//     `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
//     '85'
//   ];
  
//   // Add sample marks for each subject
//   subjects[sem].forEach(() => {
//     sampleData.push('15'); // mid1
//     sampleData.push('25'); // mid2  
//     sampleData.push('8');  // assignment
//   });
  
//   const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', `semester_${sem}_template.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


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
//       const isPass = s.subjects && s.subjects.length > 0
//         ? s.subjects.every(subject => {
//             const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//             return totalMarks >= 40;
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
//           const isPass = s.subjects && s.subjects.length > 0
//             ? s.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
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

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.name.endsWith('.csv')) {
//       showMessage('Please upload a valid CSV file', false);
//       e.target.value = '';
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleGradeChange = (subject, marks) => {
//     setFormData(prev => ({
//       ...prev,
//       grades: { ...prev.grades, [subject]: marks }
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       </div>

//       <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
//         <div className="w-full px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="h-16 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
//                 <span className="text-blue-700 font-bold text-lg">CS</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-4xl font-bold text-white">
//                   Department of Computer Science
//                 </h1>
//                 <p className="text-sm mt-1 text-blue-200">
//                   Student Management System
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

//       <div className="pt-32 pb-20 px-6">
//         <div className="max-w-7xl mx-auto">
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

//           <div className="mb-8 text-center grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button 
//               className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               onClick={analyzePerformance}
//             >
//               <i className="fas fa-chart-line mr-2"></i> View Top Performers & Slow Learners
//             </button>
//             <button 
//               className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               onClick={generateComprehensiveReport}
//             >
//               <i className="fas fa-file-alt mr-2"></i> Generate Complete Report
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">Upload Students via CSV</h3>
              
//               <div className="space-y-4">
//                 <label className="block bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center cursor-pointer hover:bg-white/20 transition-all duration-200">
//                   {selectedFile ? selectedFile.name : 'Choose CSV File'}
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <button
//                   type="button"
//                   className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     !selectedFile || isUploading
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
//                   }`}
//                   onClick={() => handleCSVUpload(selectedFile)}
//                   disabled={!selectedFile || isUploading}
//                 >
//                   {isUploading ? 'Uploading...' : 'Upload CSV'}
//                 </button>
//               </div>

//               <div className="mt-8">
//                 <h4 className="text-lg font-semibold text-white mb-4 text-center">Download Semester-wise CSV Templates</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[...Array(8)].map((_, i) => {
//                     const sem = i + 1;
//                     return (
//                       <button 
//                         type="button" 
//                         key={sem} 
//                         onClick={() => downloadTemplate(sem)}
//                         className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg border border-white/20 transition-all duration-200 hover:scale-105 text-sm"
//                       >
//                         Sem {sem}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">Add Student Manually</h3>
              
//               <form onSubmit={handleAddStudent} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input 
//                     type="text" 
//                     name="name"
//                     placeholder="Student Name" 
//                     value={formData.name} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required 
//                   />
//                   <input 
//                     type="text" 
//                     name="rollNo"
//                     placeholder="Roll Number" 
//                     value={formData.rollNo} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required 
//                   />
//                   <select 
//                     name="semester"
//                     value={formData.semester} 
//                     onChange={(e) => {
//                       handleInputChange(e);
//                       setFormData(prev => ({ ...prev, grades: {} }));
//                     }} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required
//                   >
//                     <option value="" className="text-gray-800">Select Semester</option>
//                     {[...Array(8)].map((_, i) => (
//                       <option key={i + 1} value={i + 1} className="text-gray-800">Semester {i + 1}</option>
//                     ))}
//                   </select>
//                   <select 
//                     name="session"
//                     value={formData.session} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required
//                   >
//                     <option value="" className="text-gray-800">Select Session</option>
//                     <option value="2022-2023" className="text-gray-800">2022-2023</option>
//                     <option value="2023-2024" className="text-gray-800">2023-2024</option>
//                     <option value="2024-2025" className="text-gray-800">2024-2025</option>
//                     <option value="2025-2026" className="text-gray-800">2025-2026</option>
//                   </select>
//                 </div>

//                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                   <label className="block text-white mb-2 text-sm font-medium">Training Marks (Max 100)</label>
//                   <input 
//                     type="number"
//                     name="training"
//                     placeholder="Enter Training Marks"
//                     min="0"
//                     max="100"
//                     value={formData.training}
//                     onChange={handleInputChange}
//                     className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
//                     required
//                   />
//                 </div>

//                 {formData.semester && subjects[formData.semester] && (
//                   <div className="mt-6">
//                     <h4 className="text-lg font-semibold text-white mb-4">Subject Marks (RGPV Format)</h4>
//                     <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
//                       {subjects[formData.semester].map((sub) => (
//                         <div key={sub} className="bg-white/5 rounded-xl p-4 border border-white/10">
//                           <label className="block text-white mb-2 text-sm font-medium">{sub}</label>
//                           <div className="grid grid-cols-3 gap-2">
//                             <input 
//                               type="number"
//                               placeholder="MST1 (Max 28)"
//                               min="0"
//                               max="28"
//                               value={formData.grades[sub]?.mid1 || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 mid1: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                             <input 
//                               type="number"
//                               placeholder="MST2 (Max 42)"
//                               min="0"
//                               max="42"
//                               value={formData.grades[sub]?.mid2 || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 mid2: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                             <input 
//                               type="number"
//                               placeholder="Assignment (Max 10)"
//                               min="0"
//                               max="10"
//                               value={formData.grades[sub]?.assignment || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 assignment: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {!formData.semester && (
//                   <div className="text-center py-8 text-white/70">
//                     <span className="text-2xl">📌</span>
//                     <p className="mt-2">Select semester to enter marks</p>
//                   </div>
//                 )}

//                 <button 
//                   type="submit" 
//                   disabled={isAdding}
//                   className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
//                     isAdding 
//                       ? 'bg-gray-500 cursor-not-allowed' 
//                       : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
//                   }`}
//                 >
//                   {isAdding ? 'Adding...' : 'Add Student'}
//                 </button>
//               </form>
//             </div>
//           </div>

//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//             <h3 className="text-xl font-bold text-white mb-4 text-center">Filter by Session</h3>
//             <div className="flex flex-col md:flex-row items-center justify-center gap-4">
//               <select 
//                 value={filterSession} 
//                 onChange={(e) => setFilterSession(e.target.value)}
//                 className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-48"
//               >
//                 <option value="" className="text-gray-800">-- Select Session --</option>
//                 <option value="2022-2023" className="text-gray-800">2022-2023</option>
//                 <option value="2023-2024" className="text-gray-800">2023-2024</option>
//                 <option value="2024-2025" className="text-gray-800">2024-2025</option>
//                 <option value="2025-2026" className="text-gray-800">2025-2026</option>
//               </select>
//               {filterSession && (
//                 <p className="text-blue-200 font-semibold">Currently viewing: {filterSession}</p>
//               )}
//             </div>
//           </div>

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

//           {visibleSemester && (
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">
//                 Semester {visibleSemester} - Session: {filterSession || 'All'}
//               </h3>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Student List</h4>
//                   <div className="max-h-96 overflow-y-auto">
//                     {semesterWiseStudents[visibleSemester]?.length > 0 ? (
//                       <table className="w-full text-white">
//                         <thead>
//                           <tr className="border-b border-white/20">
//                             <th className="py-3 px-4 text-left">Name</th>
//                             <th className="py-3 px-4 text-left">Roll No</th>
//                             <th className="py-3 px-4 text-left">Training</th>
//                             <th className="py-3 px-4 text-left">Status</th>
//                             <th className="py-3 px-4 text-left">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {semesterWiseStudents[visibleSemester]?.map((s) => {
//                             const isPass = s.subjects && s.subjects.length > 0
//                               ? s.subjects.every(subject => {
//                                   const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                                   return totalMarks >= 40;
//                                 }) 
//                               : false;
//                             return (
//                               <tr key={s.id} className="border-b border-white/10 hover:bg-white/5">
//                                 <td className="py-3 px-4">{s.name}</td>
//                                 <td className="py-3 px-4 font-mono">{s.rollNo}</td>
//                                 <td className="py-3 px-4 font-mono">{s.training || '0'}</td>
//                                 <td className={`py-3 px-4 font-semibold ${
//                                   isPass ? 'text-green-400' : 'text-red-400'
//                                 }`}>
//                                   {isPass ? 'Pass' : 'Fail'}
//                                 </td>
//                                 <td className="py-3 px-4">
//                                   <button 
//                                     onClick={() => handleDeleteStudent(s.id, visibleSemester)}
//                                     className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg border border-red-400/50 transition-all duration-200 hover:scale-105"
//                                   >
//                                     Delete
//                                   </button>
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
                
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Semester Performance</h4>
//                   <div className="h-64 flex items-center justify-center">
//                     <Doughnut 
//                       data={prepareChartData(semesterWiseStudents[visibleSemester])} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'bottom' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {filterSession && (
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
//                       title: { display: true, text: 'Pass/Fail by Year' }
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showPerformanceModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPerformanceModal(false)}>
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
//           [&::-webkit-scrollbar]:w-0
//           [&::-webkit-scrollbar-track]:rounded-full
//         [&::-webkit-scrollbar-track]:bg-gray-100
//           [&::-webkit-scrollbar-thumb]:rounded-full
//         [&::-webkit-scrollbar-thumb]:bg-gray-300
//        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
//       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-white/20">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Performance Analysis - Session: {filterSession}</h2>
//                 <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowPerformanceModal(false)}>
//                   &times;
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-8">
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
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
              
//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Students Needing Attention</h3>
//                 {slowLearners.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {slowLearners.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showReportModal && comprehensiveReport && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto
//         [&::-webkit-scrollbar]:w-0
//           [&::-webkit-scrollbar-track]:rounded-full
//         [&::-webkit-scrollbar-track]:bg-gray-100
//           [&::-webkit-scrollbar-thumb]:rounded-full
//         [&::-webkit-scrollbar-thumb]:bg-gray-300
//        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
//       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50
       
//           " onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-white/20">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Comprehensive Academic Report - {comprehensiveReport.session}</h2>
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={printReport}
//                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
//                   >
//                     🖨️ Print Report
//                   </button>
                  
//                   <button 
//                     onClick={downloadReportAsImage}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
//                   >
//                     📊 Download Data
//                   </button>
                  
//                   <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowReportModal(false)}>
//                     &times;
//                   </button>
//                 </div>
//               </div>
//               <p className="text-blue-200 mt-2">Generated on: {comprehensiveReport.generatedAt}</p>
//             </div>
            
//             <div ref={reportRef} className="p-6 space-y-8 bg-gradient-to-br from-blue-900 to-indigo-800">
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl font-bold text-white mb-2">Department of Computer Science</h1>
//                 <h2 className="text-2xl font-semibold text-blue-200 mb-4">Academic Performance Report</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
//                   <div>Session: <span className="font-bold">{comprehensiveReport.session}</span></div>
//                   <div>Generated On: <span className="font-bold">{comprehensiveReport.generatedAt}</span></div>
//                   <div>Total Students: <span className="font-bold">
//                     {Object.values(comprehensiveReport.semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}
//                   </span></div>
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance Charts</h3>
                
//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Semester-wise Pass/Fail Distribution</h4>
//                   <div className="h-64">
//                     <Bar 
//                       data={comprehensiveReport.semesterChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Performance Trend Across Semesters</h4>
//                   <div className="h-64">
//                     <Line 
//                       data={comprehensiveReport.trendChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         },
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                             max: 100,
//                             title: {
//                               display: true,
//                               text: 'Percentage'
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Annual Performance Summary</h4>
//                   <div className="h-64">
//                     <Bar 
//                       data={comprehensiveReport.annualChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                   {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
//                     <div key={sem} className="bg-white/10 rounded-xl p-4 border border-white/20">
//                       <h4 className="font-bold text-white text-center mb-2">Semester {sem}</h4>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex justify-between">
//                           <span>Total Students:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.totalStudents || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Passed:</span>
//                           <span className="text-green-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.passed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Failed:</span>
//                           <span className="text-red-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.failed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Pass %:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.passPercentage || 0}%</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Avg %:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.averagePercentage || 0}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Annual Summary</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
//                     <div key={year} className="bg-white/10 rounded-xl p-4 border border-white/20">
//                       <h4 className="font-bold text-white text-center mb-2">{year}</h4>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex justify-between">
//                           <span>Total Students:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.totalStudents || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Passed:</span>
//                           <span className="text-green-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalPassed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Failed:</span>
//                           <span className="text-red-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalFailed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Pass %:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.passPercentage || 0}%</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Avg %:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.averagePercentage || 0}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Top 10 Performers (Overall)</h3>
//                 {comprehensiveReport.topPerformers.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Rank</th>
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comprehensiveReport.topPerformers.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4 font-bold">{index + 1}</td>
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-green-400">{student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Slow Learner</h3>
//                 {comprehensiveReport.slowLearners.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comprehensiveReport.slowLearners.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComputerScience;










// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Doughnut, Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement
// );
// const ComputerScience = () => {
//   const [students, setStudents] = useState([]);
//   const [semesterWiseStudents, setSemesterWiseStudents] = useState({});
//   const [formData, setFormData] = useState({
//     name: '',
//     rollNo: '',
//     semester: '',
//     session: '',
//     training: '',
//     grades: {}
//   });
//   const [filterSession, setFilterSession] = useState('');
//   const [visibleSemester, setVisibleSemester] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showPerformanceModal, setShowPerformanceModal] = useState(false);
//   const [toppers, setToppers] = useState([]);
//   const [slowLearners, setSlowLearners] = useState([]);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [comprehensiveReport, setComprehensiveReport] = useState(null);
  
//   const reportRef = useRef();

//   const subjects = {
//     1: ['BT-101 - Engineering Chemistry', 'BT-102 - Mathematics-I', 'BT-104 - Basic Electrical & Electronics Engineering','BT-103 - English for Communication', 'BT-105 - Engineering Graphics'],
//     2: ['BT-201 - Engineering Physics', 'BT-202 - Mathematics-II', 'BT-203 - Basic Mechanical Engineering', 'BT-204 - Basic Civil Engineering & Mechanics','BT-205 - Basic Computer Engineering'],
//     3: ['ES-301 - Energy & Environmental Engineering', 'CS-302 - Discrete Structure', 'CS-303 - Data Structure', 'CS-304 - Digital Systems','CS-305 - Object Oriented Programming & Methodology'],
//     4: ['BT-401 - Mathematics- III', 'CS-402 - Analysis Design of Algorithm', 'CS-403 - Software Engineering', 'CS-404 - Computer Org. & Architecture','CS-405 - Operating Systems'],
//     5: ['CS-501 - Theory of Computation', 'CS-502 - Database Management Systems', 'CS-503 - Pattern Recognition', 'CS-504 - Internet and Web Technology'],
//     6: ['CS-603 - Compiler Design', 'CS-601 - Machine Learning', 'CS-604 - Project Management', 'CS-602 - Computer Networks'],
//     7: ['CS-701 - Artificial Intelligence', 'CS-702 - Cloud Computing', 'CS-703 - Cyber Security', 'CS-704 - Big Data Analytics'],
//     8: ['CS-801 - Internet of Things', 'CS-802 - Blockchain Technology', 'CS-803 - Project Work', 'CS-804 - Seminar'],
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     if (filterSession) {
//       for (let i = 1; i <= 8; i++) {
//         fetchStudentsBySemester(i);
//       }
//     }
//   }, [filterSession]);

//   const fetchStudents = async () => {
//     try {
//       const res = await axios.get('http://localhost:7070/students');
//       setStudents(res.data);
//     } catch (err) {
//       console.error('Error fetching students:', err);
//       showMessage('Failed to load students data', false);
//     }
//   };

//   const fetchStudentsBySemester = async (sem) => {
//     if (!filterSession) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:7070/students/semester/${sem}/session/${filterSession}`
//       );
//       setSemesterWiseStudents(prev => ({ ...prev, [sem]: res.data }));
//     } catch (err) {
//       console.error(`Error fetching semester ${sem}:`, err);
//       showMessage(`Failed to load semester ${sem} data`, false);
//     }
//   };

//   const calculateStudentPercentage = (student) => {
//     if (!student.subjects || student.subjects.length === 0) return 0;
    
//     let totalMarks = 0;
//     let maxMarks = 0;
    
//     student.subjects.forEach(subject => {
//       const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//       totalMarks += subjectTotal;
//       maxMarks += 80;
//     });
    
//     totalMarks += parseInt(student.training) || 0;
//     maxMarks += 100;
    
//     return maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
//   };

//   const downloadFailedStudents = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const allFailedStudents = [];
    
//     // Collect all failed students from all semesters
//     for (let sem = 1; sem <= 8; sem++) {
//       const students = semesterWiseStudents[sem] || [];
//       students.forEach(student => {
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         if (!isPass) {
//           const percentage = calculateStudentPercentage(student);
//           allFailedStudents.push({
//             name: student.name,
//             rollNo: student.rollNo,
//             semester: student.semester,
//             percentage: percentage.toFixed(2),
//             session: student.session
//           });
//         }
//       });
//     }

//     if (allFailedStudents.length === 0) {
//       showMessage('No failed students found for the selected session', true);
//       return;
//     }

//     // Sort by semester and percentage
//     allFailedStudents.sort((a, b) => {
//       if (a.semester !== b.semester) {
//         return a.semester - b.semester;
//       }
//       return a.percentage - b.percentage;
//     });

//     // Create CSV content
//     let csvContent = 'Failed Students Report\n';
//     csvContent += `Session: ${filterSession}\n`;
//     csvContent += `Generated On: ${new Date().toLocaleString()}\n`;
//     csvContent += `Total Failed Students: ${allFailedStudents.length}\n\n`;
    
//     csvContent += 'Name,Roll No,Semester,Percentage,Session\n';
    
//     allFailedStudents.forEach(student => {
//       csvContent += `${student.name},${student.rollNo},${student.semester},${student.percentage}%,${student.session}\n`;
//     });

//     // Download CSV file
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `Failed_Students_${filterSession}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
    
//     showMessage(`Downloaded ${allFailedStudents.length} failed students!`, true);
//   };

//   const downloadFailedStudentsPDF = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const allFailedStudents = [];
    
//     // Collect all failed students from all semesters
//     for (let sem = 1; sem <= 8; sem++) {
//       const students = semesterWiseStudents[sem] || [];
//       students.forEach(student => {
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         if (!isPass) {
//           const percentage = calculateStudentPercentage(student);
//           allFailedStudents.push({
//             name: student.name,
//             rollNo: student.rollNo,
//             semester: student.semester,
//             percentage: percentage.toFixed(2),
//             session: student.session
//           });
//         }
//       });
//     }

//     if (allFailedStudents.length === 0) {
//       showMessage('No failed students found for the selected session', true);
//       return;
//     }

//     // Sort by semester and percentage
//     allFailedStudents.sort((a, b) => {
//       if (a.semester !== b.semester) {
//         return a.semester - b.semester;
//       }
//       return a.percentage - b.percentage;
//     });

//     // Create PDF content
//     const printWindow = window.open('', '_blank');
    
//     let pdfContent = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Failed Students Report - ${filterSession}</title>
//           <style>
//             body { 
//               font-family: 'Arial', sans-serif;
//               background: white;
//               color: black;
//               padding: 20px;
//               line-height: 1.6;
//               margin: 0;
//             }
//             .header {
//               text-align: center;
//               border-bottom: 3px solid #dc2626;
//               padding-bottom: 20px;
//               margin-bottom: 30px;
//             }
//             .summary {
//               background: #fef2f2;
//               border: 1px solid #fecaca;
//               padding: 15px;
//               border-radius: 8px;
//               margin-bottom: 20px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//             }
//             th, td {
//               border: 1px solid #ddd;
//               padding: 12px;
//               text-align: left;
//             }
//             th {
//               background-color: #dc2626;
//               color: white;
//               font-weight: bold;
//             }
//             tr:nth-child(even) {
//               background-color: #f9f9f9;
//             }
//             .semester-heading {
//               background: #fef2f2;
//               padding: 10px;
//               margin-top: 20px;
//               border-left: 4px solid #dc2626;
//               font-weight: bold;
//             }
//             .percentage-high {
//               color: #dc2626;
//               font-weight: bold;
//             }
//             .percentage-medium {
//               color: #ea580c;
//               font-weight: bold;
//             }
//             .percentage-low {
//               color: #d97706;
//               font-weight: bold;
//             }
//             @media print {
//               body { 
//                 margin: 0;
//                 padding: 15px;
//               }
//               @page {
//                 margin: 0.5in;
//                 size: portrait;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1 style="color: #dc2626; margin-bottom: 5px; font-size: 28px;">Department of Computer Science</h1>
//             <h2 style="color: #991b1b; margin-top: 0; font-size: 22px;">Failed Students Report</h2>
//             <div style="display: flex; justify-content: center; gap: 30px; margin-top: 15px; font-size: 14px;">
//               <div><strong>Session:</strong> ${filterSession}</div>
//               <div><strong>Generated On:</strong> ${new Date().toLocaleString()}</div>
//               <div><strong>Total Failed Students:</strong> ${allFailedStudents.length}</div>
//             </div>
//           </div>

//           <div class="summary">
//             <h3 style="color: #dc2626; margin-top: 0;">Report Summary</h3>
//             <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
//               ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
//                 const semFailed = allFailedStudents.filter(s => s.semester === sem).length;
//                 return `
//                   <div style="text-align: center; padding: 8px; background: white; border-radius: 5px; border: 1px solid #fecaca;">
//                     <div style="font-weight: bold;">Semester ${sem}</div>
//                     <div style="color: #dc2626; font-size: 18px; font-weight: bold;">${semFailed}</div>
//                   </div>
//                 `;
//               }).join('')}
//             </div>
//           </div>
//     `;

//     // Group by semester
//     const studentsBySemester = {};
//     allFailedStudents.forEach(student => {
//       if (!studentsBySemester[student.semester]) {
//         studentsBySemester[student.semester] = [];
//       }
//       studentsBySemester[student.semester].push(student);
//     });

//     // Add semester-wise tables
//     [1, 2, 3, 4, 5, 6, 7, 8].forEach(sem => {
//       const semesterStudents = studentsBySemester[sem];
//       if (semesterStudents && semesterStudents.length > 0) {
//         pdfContent += `
//           <div class="semester-heading">
//             Semester ${sem} - ${semesterStudents.length} Failed Student(s)
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>S.No.</th>
//                 <th>Student Name</th>
//                 <th>Roll Number</th>
//                 <th>Percentage</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${semesterStudents.map((student, index) => {
//                 let percentageClass = 'percentage-low';
//                 if (student.percentage > 60) percentageClass = 'percentage-high';
//                 else if (student.percentage > 40) percentageClass = 'percentage-medium';
                
//                 let status = 'Needs Attention';
//                 if (student.percentage > 60) status = 'Good but Failed';
//                 else if (student.percentage > 40) status = 'Average but Failed';
                
//                 return `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td>${student.name}</td>
//                     <td>${student.rollNo}</td>
//                     <td class="${percentageClass}">${student.percentage}%</td>
//                     <td>${status}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>
//         `;
//       }
//     });

//     pdfContent += `
//           <div style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
//             <h4 style="color: #0369a1; margin-top: 0;">Legend</h4>
//             <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
//               <div>
//                 <span style="color: #dc2626; font-weight: bold;">> 60%</span> - Good but Failed (1-2 subjects)
//               </div>
//               <div>
//                 <span style="color: #ea580c; font-weight: bold;">40-60%</span> - Average but Failed (multiple subjects)
//               </div>
//               <div>
//                 <span style="color: #d97706; font-weight: bold;">&lt; 40%</span> - Needs Special Attention
//               </div>
//             </div>
//           </div>

//           <script>
//             setTimeout(() => {
//               window.print();
//               setTimeout(() => {
//                 window.close();
//               }, 100);
//             }, 500);
//           </script>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(pdfContent);
//     printWindow.document.close();
    
//     showMessage(`Generated PDF for ${allFailedStudents.length} failed students!`, true);
//   };

//   const analyzePerformance = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const allStudents = [];
//     for (let sem = 1; sem <= 8; sem++) {
//       if (semesterWiseStudents[sem]) {
//         allStudents.push(...semesterWiseStudents[sem]);
//       }
//     }

//     if (allStudents.length === 0) {
//       showMessage('No students found for the selected session', false);
//       return;
//     }

//     const studentsWithPercentage = allStudents.map(student => ({
//       ...student,
//       percentage: calculateStudentPercentage(student)
//     }));

//     const sortedStudents = [...studentsWithPercentage].sort((a, b) => b.percentage - a.percentage);
//     const top5 = sortedStudents.slice(0, 5);
//     const last5 = sortedStudents.slice(-5);

//     setToppers(top5);
//     setSlowLearners(last5);
//     setShowPerformanceModal(true);
//   };

//   const generateComprehensiveReport = () => {
//     if (!filterSession) {
//       showMessage('Please select a session first', false);
//       return;
//     }

//     const report = {
//       session: filterSession,
//       generatedAt: new Date().toLocaleString(),
//       semesterWise: {},
//       annualSummary: {},
//       topPerformers: [],
//       slowLearners: [],
//       semesterChartData: prepareSemesterChartDataForReport(),
//       annualChartData: prepareAnnualChartDataForReport(),
//       trendChartData: prepareTrendChartDataForReport()
//     };

//     for (let sem = 1; sem <= 8; sem++) {
//       const students = semesterWiseStudents[sem] || [];
//       let passed = 0;
//       let failed = 0;
//       let totalPercentage = 0;
//       const semesterToppers = [];

//       students.forEach(student => {
//         const percentage = calculateStudentPercentage(student);
//         totalPercentage += percentage;
        
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         isPass ? passed++ : failed++;
        
//         semesterToppers.push({
//           name: student.name,
//           rollNo: student.rollNo,
//           percentage: percentage
//         });
//       });

//       semesterToppers.sort((a, b) => b.percentage - a.percentage);
//       const top3 = semesterToppers.slice(0, 3);

//       report.semesterWise[sem] = {
//         totalStudents: students.length,
//         passed,
//         failed,
//         passPercentage: students.length > 0 ? ((passed / students.length) * 100).toFixed(2) : 0,
//         averagePercentage: students.length > 0 ? (totalPercentage / students.length).toFixed(2) : 0,
//         topPerformers: top3
//       };
//     }

//     const years = [
//       { label: '1st Year', semesters: [1, 2] },
//       { label: '2nd Year', semesters: [3, 4] },
//       { label: '3rd Year', semesters: [5, 6] },
//       { label: '4th Year', semesters: [7, 8] }
//     ];

//     years.forEach(year => {
//       let totalStudents = 0;
//       let totalPassed = 0;
//       let totalPercentage = 0;

//       year.semesters.forEach(sem => {
//         const students = semesterWiseStudents[sem] || [];
//         totalStudents += students.length;
        
//         students.forEach(student => {
//           const percentage = calculateStudentPercentage(student);
//           totalPercentage += percentage;
          
//           const isPass = student.subjects && student.subjects.length > 0
//             ? student.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
//               }) 
//             : false;
          
//           if (isPass) totalPassed++;
//         });
//       });

//       report.annualSummary[year.label] = {
//         totalStudents,
//         totalPassed,
//         totalFailed: totalStudents - totalPassed,
//         passPercentage: totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(2) : 0,
//         averagePercentage: totalStudents > 0 ? (totalPercentage / totalStudents).toFixed(2) : 0
//       };
//     });

//     const allStudents = [];
//     for (let sem = 1; sem <= 8; sem++) {
//       if (semesterWiseStudents[sem]) {
//         semesterWiseStudents[sem].forEach(student => {
//           allStudents.push({
//             ...student,
//             percentage: calculateStudentPercentage(student)
//           });
//         });
//       }
//     }

//     allStudents.sort((a, b) => b.percentage - a.percentage);
//     report.topPerformers = allStudents.slice(0, 10);
//     report.slowLearners = allStudents.slice(-10);

//     setComprehensiveReport(report);
//     setShowReportModal(true);
//   };

//   const prepareSemesterChartDataForReport = () => {
//     const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
//     const passData = [];
//     const failData = [];

//     semesters.forEach(sem => {
//       const students = semesterWiseStudents[sem] || [];
//       let passed = 0;
//       let failed = 0;

//       students.forEach(s => {
//         const isPass = s.subjects && s.subjects.length > 0
//           ? s.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
//         isPass ? passed++ : failed++;
//       });

//       passData.push(passed);
//       failData.push(failed);
//     });

//     return {
//       labels: semesters.map(sem => `Sem ${sem}`),
//       datasets: [
//         {
//           label: 'Passed',
//           data: passData,
//           backgroundColor: '#4CAF50',
//         },
//         {
//           label: 'Failed',
//           data: failData,
//           backgroundColor: '#FF6347',
//         }
//       ]
//     };
//   };

//   const prepareAnnualChartDataForReport = () => {
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
//           const isPass = s.subjects && s.subjects.length > 0
//             ? s.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
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

//   const prepareTrendChartDataForReport = () => {
//     const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
//     const passPercentages = [];
//     const averagePercentages = [];

//     semesters.forEach(sem => {
//       const students = semesterWiseStudents[sem] || [];
//       let totalPercentage = 0;
//       let passed = 0;

//       students.forEach(student => {
//         const percentage = calculateStudentPercentage(student);
//         totalPercentage += percentage;
        
//         const isPass = student.subjects && student.subjects.length > 0
//           ? student.subjects.every(subject => {
//               const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//               return totalMarks >= 40;
//             }) 
//           : false;
        
//         if (isPass) passed++;
//       });

//       const passPercentage = students.length > 0 ? ((passed / students.length) * 100) : 0;
//       const averagePercentage = students.length > 0 ? (totalPercentage / students.length) : 0;

//       passPercentages.push(passPercentage);
//       averagePercentages.push(averagePercentage);
//     });

//     return {
//       labels: semesters.map(sem => `Sem ${sem}`),
//       datasets: [
//         {
//           label: 'Pass Percentage',
//           data: passPercentages,
//           borderColor: '#4CAF50',
//           backgroundColor: 'rgba(76, 175, 80, 0.1)',
//           fill: true,
//           tension: 0.4
//         },
//         {
//           label: 'Average Percentage',
//           data: averagePercentages,
//           borderColor: '#2196F3',
//           backgroundColor: 'rgba(33, 150, 243, 0.1)',
//           fill: true,
//           tension: 0.4
//         }
//       ]
//     };
//   };

//   const downloadReportAsImage = async () => {
//     if (!comprehensiveReport) return;
    
//     try {
//       const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners } = comprehensiveReport;
      
//       let csvContent = "Academic Performance Report\n";
//       csvContent += `Session: ${session}, Generated: ${generatedAt}\n\n`;
      
//       csvContent += "SEMESTER-WISE PERFORMANCE\n";
//       csvContent += "Semester,Total Students,Passed,Failed,Pass %,Average %\n";
//       for (let sem = 1; sem <= 8; sem++) {
//         const data = semesterWise[sem] || {};
//         csvContent += `${sem},${data.totalStudents || 0},${data.passed || 0},${data.failed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
//       }
      
//       csvContent += "\nANNUAL SUMMARY\n";
//       csvContent += "Year,Total Students,Passed,Failed,Pass %,Average %\n";
//       ['1st Year', '2nd Year', '3rd Year', '4th Year'].forEach(year => {
//         const data = annualSummary[year] || {};
//         csvContent += `${year},${data.totalStudents || 0},${data.totalPassed || 0},${data.totalFailed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
//       });
      
//       csvContent += "\nTOP 10 PERFORMERS\n";
//       csvContent += "Rank,Name,Roll No,Semester,Percentage\n";
//       topPerformers.forEach((student, index) => {
//         csvContent += `${index + 1},${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
//       });
      
//       csvContent += "\nSTUDENTS NEEDING ATTENTION\n";
//       csvContent += "Name,Roll No,Semester,Percentage\n";
//       slowLearners.forEach(student => {
//         csvContent += `${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
//       });
      
//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `Academic_Report_${comprehensiveReport.session}.csv`;
//       link.click();
//       URL.revokeObjectURL(url);
      
//       showMessage('Report data downloaded as CSV!', true);
//     } catch (error) {
//       console.error('Error generating data:', error);
//       showMessage('Failed to download report data', false);
//     }
//   };

// const printReport = () => {
//   if (!comprehensiveReport) return;
  
//   const printWindow = window.open('', '_blank');
//   const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners } = comprehensiveReport;
  
//   const chartsContainer = document.querySelector('.bg-white\\/5.rounded-2xl.p-6.border.border-white\\/10');
//   let chartImages = '';
  
//   if (chartsContainer) {
//     const chartElements = chartsContainer.querySelectorAll('canvas');
//     chartElements.forEach((chart, index) => {
//       const chartImage = chart.toDataURL('image/png');
//       const chartTitles = [
//         'Semester-wise Pass/Fail Distribution',
//         'Performance Trend Across Semesters', 
//         'Annual Performance Summary'
//       ];
//       chartImages += `
//         <div class="chart-container" style="page-break-inside: avoid; margin: 20px 0; text-align: center;">
//           <div class="chart-title" style="font-weight: bold; margin-bottom: 10px; font-size: 16px;">${chartTitles[index]}</div>
//           <img src="${chartImage}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" />
//         </div>
//       `;
//     });
//   }
  
//   printWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Academic Report - ${comprehensiveReport.session}</title>
//         <style>
//           body { 
//             font-family: 'Arial', sans-serif;
//             background: white;
//             color: black;
//             padding: 20px;
//             line-height: 1.6;
//             margin: 0;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .header {
//             text-align: center;
//             border-bottom: 3px solid #1e3a8a;
//             padding-bottom: 20px;
//             margin-bottom: 30px;
//           }
//           .section {
//             margin-bottom: 30px;
//             page-break-inside: avoid;
//           }
//           .section-title {
//             background: #1e3a8a;
//             color: white;
//             padding: 10px;
//             margin-bottom: 15px;
//             border-radius: 5px;
//           }
//           .stats-grid {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 10px;
//             margin-bottom: 20px;
//           }
//           .stat-card {
//             border: 1px solid #ddd;
//             padding: 10px;
//             border-radius: 5px;
//             text-align: center;
//             background: white;
//           }
//           .chart-container {
//             text-align: center;
//             margin: 20px 0;
//             page-break-inside: avoid;
//           }
//           .chart-title {
//             font-weight: bold;
//             margin-bottom: 10px;
//             font-size: 16px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//             background: white;
//           }
//           th, td {
//             border: 1px solid #ddd;
//             padding: 8px;
//             text-align: left;
//           }
//           th {
//             background-color: #f8f9fa;
//             font-weight: bold;
//           }
//           .passed { color: #28a745; font-weight: bold; }
//           .failed { color: #dc3545; font-weight: bold; }
//           .top-performer { color: #28a745; }
//           .slow-learner { color: #dc3545; }
//           @media print {
//             body { 
//               margin: 0;
//               padding: 15px;
//               background: white !important;
//               color: black !important;
//             }
//             .header {
//               background: white !important;
//               color: black !important;
//             }
//             .section { 
//               page-break-inside: avoid;
//               background: white !important;
//             }
//             .section-title {
//               background: #1e3a8a !important;
//               color: white !important;
//               -webkit-print-color-adjust: exact;
//               print-color-adjust: exact;
//             }
//             .stat-card {
//               background: white !important;
//               border: 1px solid #000 !important;
//             }
//             .chart-container { 
//               page-break-inside: avoid;
//               background: white !important;
//             }
//             table {
//               background: white !important;
//             }
//             @page {
//               margin: 0.5in;
//               size: portrait;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1 style="color: #1e3a8a; margin-bottom: 5px; font-size: 28px;">Department of Computer Science</h1>
//           <h2 style="color: #3730a3; margin-top: 0; font-size: 22px;">Academic Performance Report</h2>
//           <div style="display: flex; justify-content: center; gap: 30px; margin-top: 15px; font-size: 14px;">
//             <div><strong>Session:</strong> ${session}</div>
//             <div><strong>Generated On:</strong> ${generatedAt}</div>
//             <div><strong>Total Students:</strong> ${Object.values(semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}</div>
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Performance Charts</div>
//           ${chartImages || `
//             <div class="chart-container">
//               <div class="chart-title">Semester-wise Pass/Fail Distribution</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//             <div class="chart-container">
//               <div class="chart-title">Performance Trend Across Semesters</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//             <div class="chart-container">
//               <div class="chart-title">Annual Performance Summary</div>
//               <p>Chart will appear here when data is available</p>
//             </div>
//           `}
//         </div>

//         <div class="section">
//           <div class="section-title">Semester-wise Performance</div>
//           <div class="stats-grid">
//             ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
//               const data = semesterWise[sem] || {};
//               return `
//                 <div class="stat-card">
//                   <strong>Semester ${sem}</strong><br>
//                   Total: ${data.totalStudents || 0}<br>
//                   <span class="passed">Passed: ${data.passed || 0}</span><br>
//                   <span class="failed">Failed: ${data.failed || 0}</span><br>
//                   Pass %: ${data.passPercentage || 0}%<br>
//                   Avg %: ${data.averagePercentage || 0}%
//                 </div>
//               `;
//             }).join('')}
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Annual Summary</div>
//           <div class="stats-grid">
//             ${['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => {
//               const data = annualSummary[year] || {};
//               return `
//                 <div class="stat-card">
//                   <strong>${year}</strong><br>
//                   Total: ${data.totalStudents || 0}<br>
//                   <span class="passed">Passed: ${data.totalPassed || 0}</span><br>
//                   <span class="failed">Failed: ${data.totalFailed || 0}</span><br>
//                   Pass %: ${data.passPercentage || 0}%<br>
//                   Avg %: ${data.averagePercentage || 0}%
//                 </div>
//               `;
//             }).join('')}
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Top 10 Performers (Overall)</div>
//           ${topPerformers.length > 0 ? `
//             <table>
//               <thead>
//                 <tr>
//                   <th>Rank</th>
//                   <th>Name</th>
//                   <th>Roll No</th>
//                   <th>Semester</th>
//                   <th>Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${topPerformers.map((student, index) => `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td>${student.name}</td>
//                     <td>${student.rollNo}</td>
//                     <td>Semester ${student.semester}</td>
//                     <td class="top-performer">${student.percentage.toFixed(2)}%</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           ` : '<p>No data available</p>'}
//         </div>

//         <div class="section">
//           <div class="section-title">Slow Learner</div>
//           ${slowLearners.length > 0 ? `
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Roll No</th>
//                   <th>Semester</th>
//                   <th>Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${slowLearners.map(student => `
//                   <tr>
//                     <td>${student.name}</td>
//                     <td>${student.rollNo}</td>
//                     <td>Semester ${student.semester}</td>
//                     <td class="slow-learner">${student.percentage.toFixed(2)}%</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           ` : '<p>No data available</p>'}
//         </div>

//         <script>
//           setTimeout(() => {
//             window.print();
//             setTimeout(() => {
//               window.close();
//             }, 100);
//           }, 500);
//         </script>
//       </body>
//     </html>
//   `);
//   printWindow.document.close();
// };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     setIsAdding(true);
    
//     const subjectsArray = Object.entries(formData.grades).map(([subjectName, marks]) => ({
//       subjectName: subjectName,
//       mid1: marks.mid1 || 0,
//       mid2: marks.mid2 || 0,
//       assignment: marks.assignment || 0
//     }));

//     const newStudent = {
//       name: formData.name,
//       rollNo: formData.rollNo,
//       semester: parseInt(formData.semester),
//       session: formData.session,
//       training: parseInt(formData.training) || 0,
//       subjects: subjectsArray
//     };

//     try {
//       await axios.post('http://localhost:7070/students', newStudent);
//       setFilterSession(formData.session);
//       setFormData({
//         name: '',
//         rollNo: '',
//         semester: '',
//         session: '',
//         training: '',
//         grades: {}
//       });
//       showMessage('Student added successfully!', true);
//     } catch (err) {
//       console.error('Error adding student:', err);
//       showMessage('Failed to add student. Please check the form.', false);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleDeleteStudent = async (id, semester) => {
//     try {
//       await axios.delete(`http://localhost:7070/students/${id}`);
//       await fetchStudentsBySemester(semester);
//       showMessage('Student deleted successfully!', true);
//     } catch (err) {
//       console.error('Error deleting student:', err);
//       showMessage('Error deleting student!', false);
//     }
//   };

//   const handleCSVUpload = async (file) => {
//     if (!file) {
//       showMessage('Please select a file first!', false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     setIsUploading(true);

//     try {
//       const response = await axios.post(
//         'http://localhost:7070/students/upload', 
//         formData, 
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           timeout: 10000
//         }
//       );

//       if (response.data.success) {
//         const uploadedSession = response.data.session;
//         setFilterSession(uploadedSession);
//         showMessage(
//           `CSV uploaded successfully! ${response.data.count} students added. Session: ${uploadedSession}`,
//           true
//         );
        
//         for (let i = 1; i <= 8; i++) {
//           await fetchStudentsBySemester(i);
//         }
//         setVisibleSemester(1);
//       }
//     } catch (error) {
//       console.error('Upload failed:', error);
//       const errorMsg = error.response?.data?.message || 
//                       error.message || 
//                       'Failed to upload CSV. Please check the file format.';
//       showMessage(errorMsg, false);
//     } finally {
//       setIsUploading(false);
//       setSelectedFile(null);
//     }
//   };

// const downloadTemplate = (sem) => {
//   const headers = ['name', 'rollNo', 'semester', 'session', 'training'];
  
//   // Use simple subject names without codes for CSV headers
//   subjects[sem].forEach(sub => {
//     // Extract just the subject name without code (e.g., "Mathematics" from "BT-101 - Engineering Mathematics")
//     const subjectName = sub.split(' - ')[1] || sub;
//     headers.push(`${subjectName}.mid1`);
//     headers.push(`${subjectName}.mid2`);
//     headers.push(`${subjectName}.assignment`);
//   });
  
//   const sampleData = [
//     'shubham  raj', 
//     `CS${new Date().getFullYear()}${sem.toString().padStart(3, '0')}`, 
//     sem, 
//     `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
//     '85'
//   ];
  
//   // Add sample marks for each subject
//   subjects[sem].forEach(() => {
//     sampleData.push('15'); // mid1
//     sampleData.push('25'); // mid2  
//     sampleData.push('8');  // assignment
//   });
  
//   const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', `semester_${sem}_template.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


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
//       const isPass = s.subjects && s.subjects.length > 0
//         ? s.subjects.every(subject => {
//             const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//             return totalMarks >= 40;
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
//           const isPass = s.subjects && s.subjects.length > 0
//             ? s.subjects.every(subject => {
//                 const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                 return totalMarks >= 40;
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

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.name.endsWith('.csv')) {
//       showMessage('Please upload a valid CSV file', false);
//       e.target.value = '';
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleGradeChange = (subject, marks) => {
//     setFormData(prev => ({
//       ...prev,
//       grades: { ...prev.grades, [subject]: marks }
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       </div>

//       <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
//         <div className="w-full px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="h-16 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
//                 <span className="text-blue-700 font-bold text-lg">CS</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-4xl font-bold text-white">
//                   Department of Computer Science
//                 </h1>
//                 <p className="text-sm mt-1 text-blue-200">
//                   Student Management System
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

//       <div className="pt-32 pb-20 px-6">
//         <div className="max-w-7xl mx-auto">
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

//           <div className="mb-8 text-center grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button 
//               className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               onClick={analyzePerformance}
//             >
//               <i className="fas fa-chart-line mr-2"></i> View Top Performers & Slow Learners
//             </button>
//             <button 
//               className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               onClick={generateComprehensiveReport}
//             >
//               <i className="fas fa-file-alt mr-2"></i> Generate Complete Report
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">Upload Students via CSV</h3>
              
//               <div className="space-y-4">
//                 <label className="block bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center cursor-pointer hover:bg-white/20 transition-all duration-200">
//                   {selectedFile ? selectedFile.name : 'Choose CSV File'}
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <button
//                   type="button"
//                   className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     !selectedFile || isUploading
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
//                   }`}
//                   onClick={() => handleCSVUpload(selectedFile)}
//                   disabled={!selectedFile || isUploading}
//                 >
//                   {isUploading ? 'Uploading...' : 'Upload CSV'}
//                 </button>
//               </div>

//               <div className="mt-8">
//                 <h4 className="text-lg font-semibold text-white mb-4 text-center">Download Semester-wise CSV Templates</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[...Array(8)].map((_, i) => {
//                     const sem = i + 1;
//                     return (
//                       <button 
//                         type="button" 
//                         key={sem} 
//                         onClick={() => downloadTemplate(sem)}
//                         className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg border border-white/20 transition-all duration-200 hover:scale-105 text-sm"
//                       >
//                         Sem {sem}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">Add Student Manually</h3>
              
//               <form onSubmit={handleAddStudent} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input 
//                     type="text" 
//                     name="name"
//                     placeholder="Student Name" 
//                     value={formData.name} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required 
//                   />
//                   <input 
//                     type="text" 
//                     name="rollNo"
//                     placeholder="Roll Number" 
//                     value={formData.rollNo} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required 
//                   />
//                   <select 
//                     name="semester"
//                     value={formData.semester} 
//                     onChange={(e) => {
//                       handleInputChange(e);
//                       setFormData(prev => ({ ...prev, grades: {} }));
//                     }} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required
//                   >
//                     <option value="" className="text-gray-800">Select Semester</option>
//                     {[...Array(8)].map((_, i) => (
//                       <option key={i + 1} value={i + 1} className="text-gray-800">Semester {i + 1}</option>
//                     ))}
//                   </select>
//                   <select 
//                     name="session"
//                     value={formData.session} 
//                     onChange={handleInputChange} 
//                     className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     required
//                   >
//                     <option value="" className="text-gray-800">Select Session</option>
//                     <option value="2022-2023" className="text-gray-800">2022-2023</option>
//                     <option value="2023-2024" className="text-gray-800">2023-2024</option>
//                     <option value="2024-2025" className="text-gray-800">2024-2025</option>
//                     <option value="2025-2026" className="text-gray-800">2025-2026</option>
//                   </select>
//                 </div>

//                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                   <label className="block text-white mb-2 text-sm font-medium">Training Marks (Max 100)</label>
//                   <input 
//                     type="number"
//                     name="training"
//                     placeholder="Enter Training Marks"
//                     min="0"
//                     max="100"
//                     value={formData.training}
//                     onChange={handleInputChange}
//                     className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
//                     required
//                   />
//                 </div>

//                 {formData.semester && subjects[formData.semester] && (
//                   <div className="mt-6">
//                     <h4 className="text-lg font-semibold text-white mb-4">Subject Marks (RGPV Format)</h4>
//                     <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
//                       {subjects[formData.semester].map((sub) => (
//                         <div key={sub} className="bg-white/5 rounded-xl p-4 border border-white/10">
//                           <label className="block text-white mb-2 text-sm font-medium">{sub}</label>
//                           <div className="grid grid-cols-3 gap-2">
//                             <input 
//                               type="number"
//                               placeholder="MST1 (Max 28)"
//                               min="0"
//                               max="28"
//                               value={formData.grades[sub]?.mid1 || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 mid1: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                             <input 
//                               type="number"
//                               placeholder="MST2 (Max 42)"
//                               min="0"
//                               max="42"
//                               value={formData.grades[sub]?.mid2 || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 mid2: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                             <input 
//                               type="number"
//                               placeholder="Assignment (Max 10)"
//                               min="0"
//                               max="10"
//                               value={formData.grades[sub]?.assignment || ''}
//                               onChange={(e) => handleGradeChange(sub, { 
//                                 ...formData.grades[sub], 
//                                 assignment: parseInt(e.target.value) || 0 
//                               })}
//                               className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                               required
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {!formData.semester && (
//                   <div className="text-center py-8 text-white/70">
//                     <span className="text-2xl">📌</span>
//                     <p className="mt-2">Select semester to enter marks</p>
//                   </div>
//                 )}

//                 <button 
//                   type="submit" 
//                   disabled={isAdding}
//                   className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
//                     isAdding 
//                       ? 'bg-gray-500 cursor-not-allowed' 
//                       : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
//                   }`}
//                 >
//                   {isAdding ? 'Adding...' : 'Add Student'}
//                 </button>
//               </form>
//             </div>
//           </div>

//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//             <h3 className="text-xl font-bold text-white mb-4 text-center">Filter by Session</h3>
//             <div className="flex flex-col md:flex-row items-center justify-center gap-4">
//               <select 
//                 value={filterSession} 
//                 onChange={(e) => setFilterSession(e.target.value)}
//                 className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-48"
//               >
//                 <option value="" className="text-gray-800">-- Select Session --</option>
//                 <option value="2022-2023" className="text-gray-800">2022-2023</option>
//                 <option value="2023-2024" className="text-gray-800">2023-2024</option>
//                 <option value="2024-2025" className="text-gray-800">2024-2025</option>
//                 <option value="2025-2026" className="text-gray-800">2025-2026</option>
//               </select>
//               {filterSession && (
//                 <p className="text-blue-200 font-semibold">Currently viewing: {filterSession}</p>
//               )}
//             </div>
            
//             {filterSession && (
//               <div className="mt-4 text-center grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <button 
//                   onClick={downloadFailedStudents}
//                   className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//                 >
//                   <i className="fas fa-download mr-2"></i> Download Failed Students List
//                 </button>
                
//                 <button 
//                   onClick={downloadFailedStudentsPDF}
//                   className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//                 >
//                   <i className="fas fa-file-pdf mr-2"></i> Download Failed Students (PDF)
//                 </button>
//               </div>
//             )}
//           </div>

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

//           {visibleSemester && (
//             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
//               <h3 className="text-2xl font-bold text-white mb-6 text-center">
//                 Semester {visibleSemester} - Session: {filterSession || 'All'}
//               </h3>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Student List</h4>
//                   <div className="max-h-96 overflow-y-auto">
//                     {semesterWiseStudents[visibleSemester]?.length > 0 ? (
//                       <table className="w-full text-white">
//                         <thead>
//                           <tr className="border-b border-white/20">
//                             <th className="py-3 px-4 text-left">Name</th>
//                             <th className="py-3 px-4 text-left">Roll No</th>
//                             <th className="py-3 px-4 text-left">Training</th>
//                             <th className="py-3 px-4 text-left">Status</th>
//                             <th className="py-3 px-4 text-left">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {semesterWiseStudents[visibleSemester]?.map((s) => {
//                             const isPass = s.subjects && s.subjects.length > 0
//                               ? s.subjects.every(subject => {
//                                   const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
//                                   return totalMarks >= 40;
//                                 }) 
//                               : false;
//                             return (
//                               <tr key={s.id} className="border-b border-white/10 hover:bg-white/5">
//                                 <td className="py-3 px-4">{s.name}</td>
//                                 <td className="py-3 px-4 font-mono">{s.rollNo}</td>
//                                 <td className="py-3 px-4 font-mono">{s.training || '0'}</td>
//                                 <td className={`py-3 px-4 font-semibold ${
//                                   isPass ? 'text-green-400' : 'text-red-400'
//                                 }`}>
//                                   {isPass ? 'Pass' : 'Fail'}
//                                 </td>
//                                 <td className="py-3 px-4">
//                                   <button 
//                                     onClick={() => handleDeleteStudent(s.id, visibleSemester)}
//                                     className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg border border-red-400/50 transition-all duration-200 hover:scale-105"
//                                   >
//                                     Delete
//                                   </button>
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
                
//                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                   <h4 className="text-xl font-semibold text-white mb-4">Semester Performance</h4>
//                   <div className="h-64 flex items-center justify-center">
//                     <Doughnut 
//                       data={prepareChartData(semesterWiseStudents[visibleSemester])} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'bottom' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {filterSession && (
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
//                       title: { display: true, text: 'Pass/Fail by Year' }
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showPerformanceModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPerformanceModal(false)}>
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
//           [&::-webkit-scrollbar]:w-0
//           [&::-webkit-scrollbar-track]:rounded-full
//         [&::-webkit-scrollbar-track]:bg-gray-100
//           [&::-webkit-scrollbar-thumb]:rounded-full
//         [&::-webkit-scrollbar-thumb]:bg-gray-300
//        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
//       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-white/20">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Performance Analysis - Session: {filterSession}</h2>
//                 <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowPerformanceModal(false)}>
//                   &times;
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-8">
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
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
              
//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Students Needing Attention</h3>
//                 {slowLearners.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {slowLearners.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4">{student.name}</td>
//                           <td className="py-3 px-4 font-mono">{student.rollNo}</td>
//                           <td className="py-3 px-4">Semester {student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showReportModal && comprehensiveReport && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto
//         [&::-webkit-scrollbar]:w-0
//           [&::-webkit-scrollbar-track]:rounded-full
//         [&::-webkit-scrollbar-track]:bg-gray-100
//           [&::-webkit-scrollbar-thumb]:rounded-full
//         [&::-webkit-scrollbar-thumb]:bg-gray-300
//        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
//       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50
       
//           " onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-white/20">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Comprehensive Academic Report - {comprehensiveReport.session}</h2>
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={printReport}
//                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
//                   >
//                     🖨️ Print Report
//                   </button>
                  
//                   <button 
//                     onClick={downloadReportAsImage}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
//                   >
//                     📊 Download Data
//                   </button>
                  
//                   <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowReportModal(false)}>
//                     &times;
//                   </button>
//                 </div>
//               </div>
//               <p className="text-blue-200 mt-2">Generated on: {comprehensiveReport.generatedAt}</p>
//             </div>
            
//             <div ref={reportRef} className="p-6 space-y-8 bg-gradient-to-br from-blue-900 to-indigo-800">
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl font-bold text-white mb-2">Department of Computer Science</h1>
//                 <h2 className="text-2xl font-semibold text-blue-200 mb-4">Academic Performance Report</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
//                   <div>Session: <span className="font-bold">{comprehensiveReport.session}</span></div>
//                   <div>Generated On: <span className="font-bold">{comprehensiveReport.generatedAt}</span></div>
//                   <div>Total Students: <span className="font-bold">
//                     {Object.values(comprehensiveReport.semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}
//                   </span></div>
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance Charts</h3>
                
//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Semester-wise Pass/Fail Distribution</h4>
//                   <div className="h-64">
//                     <Bar 
//                       data={comprehensiveReport.semesterChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Performance Trend Across Semesters</h4>
//                   <div className="h-64">
//                     <Line 
//                       data={comprehensiveReport.trendChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         },
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                             max: 100,
//                             title: {
//                               display: true,
//                               text: 'Percentage'
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-semibold text-white mb-4 text-center">Annual Performance Summary</h4>
//                   <div className="h-64">
//                     <Bar 
//                       data={comprehensiveReport.annualChartData} 
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: { position: 'top' }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                   {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
//                     <div key={sem} className="bg-white/10 rounded-xl p-4 border border-white/20">
//                       <h4 className="font-bold text-white text-center mb-2">Semester ${sem}</h4>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex justify-between">
//                           <span>Total Students:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.totalStudents || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Passed:</span>
//                           <span className="text-green-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.passed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Failed:</span>
//                           <span className="text-red-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.failed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Pass %:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.passPercentage || 0}%</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Avg %:</span>
//                           <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.averagePercentage || 0}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Annual Summary</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
//                     <div key={year} className="bg-white/10 rounded-xl p-4 border border-white/20">
//                       <h4 className="font-bold text-white text-center mb-2">${year}</h4>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex justify-between">
//                           <span>Total Students:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.totalStudents || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Passed:</span>
//                           <span className="text-green-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalPassed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Failed:</span>
//                           <span className="text-red-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalFailed || 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Pass %:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.passPercentage || 0}%</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Avg %:</span>
//                           <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.averagePercentage || 0}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Top 10 Performers (Overall)</h3>
//                 {comprehensiveReport.topPerformers.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Rank</th>
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comprehensiveReport.topPerformers.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4 font-bold">${index + 1}</td>
//                           <td className="py-3 px-4">${student.name}</td>
//                           <td className="py-3 px-4 font-mono">${student.rollNo}</td>
//                           <td className="py-3 px-4">Semester ${student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-green-400">${student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>

//               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Slow Learner</h3>
//                 {comprehensiveReport.slowLearners.length > 0 ? (
//                   <table className="w-full text-white">
//                     <thead>
//                       <tr className="border-b border-white/20">
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Roll No</th>
//                         <th className="py-3 px-4 text-left">Semester</th>
//                         <th className="py-3 px-4 text-left">Percentage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comprehensiveReport.slowLearners.map((student, index) => (
//                         <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
//                           <td className="py-3 px-4">${student.name}</td>
//                           <td className="py-3 px-4 font-mono">${student.rollNo}</td>
//                           <td className="py-3 px-4">Semester ${student.semester}</td>
//                           <td className="py-3 px-4 font-bold text-red-400">${student.percentage.toFixed(2)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-4 text-white/70">No data available</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComputerScience;







import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const ComputerScience = () => {
  const [students, setStudents] = useState([]);
  const [semesterWiseStudents, setSemesterWiseStudents] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    semester: '',
    session: '',
    training: '',
    grades: {}
  });
  const [filterSession, setFilterSession] = useState('');
  const [visibleSemester, setVisibleSemester] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [toppers, setToppers] = useState([]);
  const [slowLearners, setSlowLearners] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [comprehensiveReport, setComprehensiveReport] = useState(null);
  
  const reportRef = useRef();

  const subjects = {
    1: ['BT-101 - Engineering Chemistry', 'BT-102 - Mathematics-I', 'BT-104 - Basic Electrical & Electronics Engineering','BT-103 - English for Communication', 'BT-105 - Engineering Graphics'],
    2: ['BT-201 - Engineering Physics', 'BT-202 - Mathematics-II', 'BT-203 - Basic Mechanical Engineering', 'BT-204 - Basic Civil Engineering & Mechanics','BT-205 - Basic Computer Engineering'],
    3: ['ES-301 - Energy & Environmental Engineering', 'CS-302 - Discrete Structure', 'CS-303 - Data Structure', 'CS-304 - Digital Systems','CS-305 - Object Oriented Programming & Methodology'],
    4: ['BT-401 - Mathematics- III', 'CS-402 - Analysis Design of Algorithm', 'CS-403 - Software Engineering', 'CS-404 - Computer Org. & Architecture','CS-405 - Operating Systems'],
    5: ['CS-501 - Theory of Computation', 'CS-502 - Database Management Systems', 'CS-503 - Pattern Recognition', 'CS-504 - Internet and Web Technology'],
    6: ['CS-603 - Compiler Design', 'CS-601 - Machine Learning', 'CS-604 - Project Management', 'CS-602 - Computer Networks'],
    7: ['CS-701 - Artificial Intelligence', 'CS-702 - Cloud Computing', 'CS-703 - Cyber Security', 'CS-704 - Big Data Analytics'],
    8: ['CS-801 - Internet of Things', 'CS-802 - Blockchain Technology', 'CS-803 - Project Work', 'CS-804 - Seminar'],
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (filterSession) {
      for (let i = 1; i <= 8; i++) {
        fetchStudentsBySemester(i);
      }
    }
  }, [filterSession]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:7070/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      showMessage('Failed to load students data', false);
    }
  };

  const fetchStudentsBySemester = async (sem) => {
    if (!filterSession) return;
    try {
      const res = await axios.get(
        `http://localhost:7070/students/semester/${sem}/session/${filterSession}`
      );
      setSemesterWiseStudents(prev => ({ ...prev, [sem]: res.data }));
    } catch (err) {
      console.error(`Error fetching semester ${sem}:`, err);
      showMessage(`Failed to load semester ${sem} data`, false);
    }
  };

  const calculateStudentPercentage = (student) => {
    if (!student.subjects || student.subjects.length === 0) return 0;
    
    let totalMarks = 0;
    let maxMarks = 0;
    
    student.subjects.forEach(subject => {
      const subjectTotal = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
      totalMarks += subjectTotal;
      maxMarks += 80;
    });
    
    totalMarks += parseInt(student.training) || 0;
    maxMarks += 100;
    
    return maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
  };

  const analyzePerformance = () => {
    if (!filterSession) {
      showMessage('Please select a session first', false);
      return;
    }

    const allStudents = [];
    for (let sem = 1; sem <= 8; sem++) {
      if (semesterWiseStudents[sem]) {
        allStudents.push(...semesterWiseStudents[sem]);
      }
    }

    if (allStudents.length === 0) {
      showMessage('No students found for the selected session', false);
      return;
    }

    const studentsWithPercentage = allStudents.map(student => ({
      ...student,
      percentage: calculateStudentPercentage(student)
    }));

    const sortedStudents = [...studentsWithPercentage].sort((a, b) => b.percentage - a.percentage);
    const top5 = sortedStudents.slice(0, 5);
    const last5 = sortedStudents.slice(-5);

    setToppers(top5);
    setSlowLearners(last5);
    setShowPerformanceModal(true);
  };

  const generateComprehensiveReport = () => {
    if (!filterSession) {
      showMessage('Please select a session first', false);
      return;
    }

    const report = {
      session: filterSession,
      generatedAt: new Date().toLocaleString(),
      semesterWise: {},
      annualSummary: {},
      topPerformers: [],
      slowLearners: [],
      allFailedStudents: [],
      semesterChartData: prepareSemesterChartDataForReport(),
      annualChartData: prepareAnnualChartDataForReport(),
      trendChartData: prepareTrendChartDataForReport()
    };

    // Collect all failed students for the new section
    const allFailedStudents = [];
    
    for (let sem = 1; sem <= 8; sem++) {
      const students = semesterWiseStudents[sem] || [];
      let passed = 0;
      let failed = 0;
      let totalPercentage = 0;
      const semesterToppers = [];

      students.forEach(student => {
        const percentage = calculateStudentPercentage(student);
        totalPercentage += percentage;
        
        const isPass = student.subjects && student.subjects.length > 0
          ? student.subjects.every(subject => {
              const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
              return totalMarks >= 40;
            }) 
          : false;
        
        isPass ? passed++ : failed++;
        
        // Add to all failed students list
        if (!isPass) {
          allFailedStudents.push({
            name: student.name,
            rollNo: student.rollNo,
            semester: student.semester,
            percentage: percentage,
            session: student.session
          });
        }
        
        semesterToppers.push({
          name: student.name,
          rollNo: student.rollNo,
          percentage: percentage
        });
      });

      semesterToppers.sort((a, b) => b.percentage - a.percentage);
      const top3 = semesterToppers.slice(0, 3);

      report.semesterWise[sem] = {
        totalStudents: students.length,
        passed,
        failed,
        passPercentage: students.length > 0 ? ((passed / students.length) * 100).toFixed(2) : 0,
        averagePercentage: students.length > 0 ? (totalPercentage / students.length).toFixed(2) : 0,
        topPerformers: top3
      };
    }

    // Sort all failed students by semester and percentage
    allFailedStudents.sort((a, b) => {
      if (a.semester !== b.semester) {
        return a.semester - b.semester;
      }
      return a.percentage - b.percentage;
    });
    
    report.allFailedStudents = allFailedStudents;

    const years = [
      { label: '1st Year', semesters: [1, 2] },
      { label: '2nd Year', semesters: [3, 4] },
      { label: '3rd Year', semesters: [5, 6] },
      { label: '4th Year', semesters: [7, 8] }
    ];

    years.forEach(year => {
      let totalStudents = 0;
      let totalPassed = 0;
      let totalPercentage = 0;

      year.semesters.forEach(sem => {
        const students = semesterWiseStudents[sem] || [];
        totalStudents += students.length;
        
        students.forEach(student => {
          const percentage = calculateStudentPercentage(student);
          totalPercentage += percentage;
          
          const isPass = student.subjects && student.subjects.length > 0
            ? student.subjects.every(subject => {
                const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
                return totalMarks >= 40;
              }) 
            : false;
          
          if (isPass) totalPassed++;
        });
      });

      report.annualSummary[year.label] = {
        totalStudents,
        totalPassed,
        totalFailed: totalStudents - totalPassed,
        passPercentage: totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(2) : 0,
        averagePercentage: totalStudents > 0 ? (totalPercentage / totalStudents).toFixed(2) : 0
      };
    });

    const allStudents = [];
    for (let sem = 1; sem <= 8; sem++) {
      if (semesterWiseStudents[sem]) {
        semesterWiseStudents[sem].forEach(student => {
          allStudents.push({
            ...student,
            percentage: calculateStudentPercentage(student)
          });
        });
      }
    }

    allStudents.sort((a, b) => b.percentage - a.percentage);
    report.topPerformers = allStudents.slice(0, 10);
    report.slowLearners = allStudents.slice(-10);

    setComprehensiveReport(report);
    setShowReportModal(true);
  };

  const prepareSemesterChartDataForReport = () => {
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const passData = [];
    const failData = [];

    semesters.forEach(sem => {
      const students = semesterWiseStudents[sem] || [];
      let passed = 0;
      let failed = 0;

      students.forEach(s => {
        const isPass = s.subjects && s.subjects.length > 0
          ? s.subjects.every(subject => {
              const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
              return totalMarks >= 40;
            }) 
          : false;
        isPass ? passed++ : failed++;
      });

      passData.push(passed);
      failData.push(failed);
    });

    return {
      labels: semesters.map(sem => `Sem ${sem}`),
      datasets: [
        {
          label: 'Passed',
          data: passData,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Failed',
          data: failData,
          backgroundColor: '#FF6347',
        }
      ]
    };
  };

  const prepareAnnualChartDataForReport = () => {
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
          const isPass = s.subjects && s.subjects.length > 0
            ? s.subjects.every(subject => {
                const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
                return totalMarks >= 40;
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

  const prepareTrendChartDataForReport = () => {
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const passPercentages = [];
    const averagePercentages = [];

    semesters.forEach(sem => {
      const students = semesterWiseStudents[sem] || [];
      let totalPercentage = 0;
      let passed = 0;

      students.forEach(student => {
        const percentage = calculateStudentPercentage(student);
        totalPercentage += percentage;
        
        const isPass = student.subjects && student.subjects.length > 0
          ? student.subjects.every(subject => {
              const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
              return totalMarks >= 40;
            }) 
          : false;
        
        if (isPass) passed++;
      });

      const passPercentage = students.length > 0 ? ((passed / students.length) * 100) : 0;
      const averagePercentage = students.length > 0 ? (totalPercentage / students.length) : 0;

      passPercentages.push(passPercentage);
      averagePercentages.push(averagePercentage);
    });

    return {
      labels: semesters.map(sem => `Sem ${sem}`),
      datasets: [
        {
          label: 'Pass Percentage',
          data: passPercentages,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Average Percentage',
          data: averagePercentages,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const downloadReportAsImage = async () => {
    if (!comprehensiveReport) return;
    
    try {
      const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners, allFailedStudents } = comprehensiveReport;
      
      let csvContent = "Academic Performance Report\n";
      csvContent += `Session: ${session}, Generated: ${generatedAt}\n\n`;
      
      csvContent += "SEMESTER-WISE PERFORMANCE\n";
      csvContent += "Semester,Total Students,Passed,Failed,Pass %,Average %\n";
      for (let sem = 1; sem <= 8; sem++) {
        const data = semesterWise[sem] || {};
        csvContent += `${sem},${data.totalStudents || 0},${data.passed || 0},${data.failed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
      }
      
      csvContent += "\nANNUAL SUMMARY\n";
      csvContent += "Year,Total Students,Passed,Failed,Pass %,Average %\n";
      ['1st Year', '2nd Year', '3rd Year', '4th Year'].forEach(year => {
        const data = annualSummary[year] || {};
        csvContent += `${year},${data.totalStudents || 0},${data.totalPassed || 0},${data.totalFailed || 0},${data.passPercentage || 0},${data.averagePercentage || 0}\n`;
      });
      
      csvContent += "\nTOP 10 PERFORMERS\n";
      csvContent += "Rank,Name,Roll No,Semester,Percentage\n";
      topPerformers.forEach((student, index) => {
        csvContent += `${index + 1},${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
      });
      
      csvContent += "\nSTUDENTS NEEDING ATTENTION (SLOW LEARNERS)\n";
      csvContent += "Name,Roll No,Semester,Percentage\n";
      slowLearners.forEach(student => {
        csvContent += `${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)}\n`;
      });
      
      // Add all failed students to CSV
      csvContent += "\nALL FAILED STUDENTS\n";
      csvContent += "Name,Roll No,Semester,Percentage,Session\n";
      allFailedStudents.forEach(student => {
        csvContent += `${student.name},${student.rollNo},${student.semester},${student.percentage.toFixed(2)},${student.session}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Academic_Report_${comprehensiveReport.session}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      showMessage('Report data downloaded as CSV!', true);
    } catch (error) {
      console.error('Error generating data:', error);
      showMessage('Failed to download report data', false);
    }
  };

  const printReport = () => {
    if (!comprehensiveReport) return;
    
    const printWindow = window.open('', '_blank');
    const { session, generatedAt, semesterWise, annualSummary, topPerformers, slowLearners, allFailedStudents } = comprehensiveReport;
    
    const chartsContainer = document.querySelector('.bg-white\\/5.rounded-2xl.p-6.border.border-white\\/10');
    let chartImages = '';
    
    if (chartsContainer) {
      const chartElements = chartsContainer.querySelectorAll('canvas');
      chartElements.forEach((chart, index) => {
        const chartImage = chart.toDataURL('image/png');
        const chartTitles = [
          'Semester-wise Pass/Fail Distribution',
          'Performance Trend Across Semesters', 
          'Annual Performance Summary'
        ];
        chartImages += `
          <div class="chart-container" style="page-break-inside: avoid; margin: 20px 0; text-align: center;">
            <div class="chart-title" style="font-weight: bold; margin-bottom: 10px; font-size: 16px;">${chartTitles[index]}</div>
            <img src="${chartImage}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" />
          </div>
        `;
      });
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Report - ${comprehensiveReport.session}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif;
              background: white;
              color: black;
              padding: 20px;
              line-height: 1.6;
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #1e3a8a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section-title {
              background: #1e3a8a;
              color: white;
              padding: 10px;
              margin-bottom: 15px;
              border-radius: 5px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 20px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              background: white;
            }
            .chart-container {
              text-align: center;
              margin: 20px 0;
              page-break-inside: avoid;
            }
            .chart-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              background: white;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
            }
            .passed { color: #28a745; font-weight: bold; }
            .failed { color: #dc3545; font-weight: bold; }
            .top-performer { color: #28a745; }
            .slow-learner { color: #dc3545; }
            .failed-student { color: #dc3545; }
            @media print {
              body { 
                margin: 0;
                padding: 15px;
                background: white !important;
                color: black !important;
              }
              .header {
                background: white !important;
                color: black !important;
              }
              .section { 
                page-break-inside: avoid;
                background: white !important;
              }
              .section-title {
                background: #1e3a8a !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .stat-card {
                background: white !important;
                border: 1px solid #000 !important;
              }
              .chart-container { 
                page-break-inside: avoid;
                background: white !important;
              }
              table {
                background: white !important;
              }
              @page {
                margin: 0.5in;
                size: portrait;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #1e3a8a; margin-bottom: 5px; font-size: 28px;">Department of Computer Science</h1>
            <h2 style="color: #3730a3; margin-top: 0; font-size: 22px;">Academic Performance Report</h2>
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 15px; font-size: 14px;">
              <div><strong>Session:</strong> ${session}</div>
              <div><strong>Generated On:</strong> ${generatedAt}</div>
              <div><strong>Total Students:</strong> ${Object.values(semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}</div>
              <div><strong>Total Failed:</strong> ${allFailedStudents.length}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Performance Charts</div>
            ${chartImages || `
              <div class="chart-container">
                <div class="chart-title">Semester-wise Pass/Fail Distribution</div>
                <p>Chart will appear here when data is available</p>
              </div>
              <div class="chart-container">
                <div class="chart-title">Performance Trend Across Semesters</div>
                <p>Chart will appear here when data is available</p>
              </div>
              <div class="chart-container">
                <div class="chart-title">Annual Performance Summary</div>
                <p>Chart will appear here when data is available</p>
              </div>
            `}
          </div>

          <div class="section">
            <div class="section-title">Semester-wise Performance</div>
            <div class="stats-grid">
              ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                const data = semesterWise[sem] || {};
                return `
                  <div class="stat-card">
                    <strong>Semester ${sem}</strong><br>
                    Total: ${data.totalStudents || 0}<br>
                    <span class="passed">Passed: ${data.passed || 0}</span><br>
                    <span class="failed">Failed: ${data.failed || 0}</span><br>
                    Pass %: ${data.passPercentage || 0}%<br>
                    Avg %: ${data.averagePercentage || 0}%
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Annual Summary</div>
            <div class="stats-grid">
              ${['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => {
                const data = annualSummary[year] || {};
                return `
                  <div class="stat-card">
                    <strong>${year}</strong><br>
                    Total: ${data.totalStudents || 0}<br>
                    <span class="passed">Passed: ${data.totalPassed || 0}</span><br>
                    <span class="failed">Failed: ${data.totalFailed || 0}</span><br>
                    Pass %: ${data.passPercentage || 0}%<br>
                    Avg %: ${data.averagePercentage || 0}%
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Top 10 Performers (Overall)</div>
            ${topPerformers.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Semester</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  ${topPerformers.map((student, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${student.name}</td>
                      <td>${student.rollNo}</td>
                      <td>Semester ${student.semester}</td>
                      <td class="top-performer">${student.percentage.toFixed(2)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No data available</p>'}
          </div>

          <div class="section">
            <div class="section-title">Students Needing Attention (Slow Learners)</div>
            ${slowLearners.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Semester</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  ${slowLearners.map(student => `
                    <tr>
                      <td>${student.name}</td>
                      <td>${student.rollNo}</td>
                      <td>Semester ${student.semester}</td>
                      <td class="slow-learner">${student.percentage.toFixed(2)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No data available</p>'}
          </div>

          <div class="section">
            <div class="section-title">All Failed Students (${allFailedStudents.length} Students)</div>
            ${allFailedStudents.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Semester</th>
                    <th>Percentage</th>
                    <th>Session</th>
                  </tr>
                </thead>
                <tbody>
                  ${allFailedStudents.map((student, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${student.name}</td>
                      <td>${student.rollNo}</td>
                      <td>Semester ${student.semester}</td>
                      <td class="failed-student">${student.percentage.toFixed(2)}%</td>
                      <td>${student.session}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No failed students found</p>'}
          </div>

          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => {
                window.close();
              }, 100);
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    const subjectsArray = Object.entries(formData.grades).map(([subjectName, marks]) => ({
      subjectName: subjectName,
      mid1: marks.mid1 || 0,
      mid2: marks.mid2 || 0,
      assignment: marks.assignment || 0
    }));

    const newStudent = {
      name: formData.name,
      rollNo: formData.rollNo,
      semester: parseInt(formData.semester),
      session: formData.session,
      training: parseInt(formData.training) || 0,
      subjects: subjectsArray
    };

    try {
      await axios.post('http://localhost:7070/students', newStudent);
      setFilterSession(formData.session);
      setFormData({
        name: '',
        rollNo: '',
        semester: '',
        session: '',
        training: '',
        grades: {}
      });
      showMessage('Student added successfully!', true);
    } catch (err) {
      console.error('Error adding student:', err);
      showMessage('Failed to add student. Please check the form.', false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteStudent = async (id, semester) => {
    try {
      await axios.delete(`http://localhost:7070/students/${id}`);
      await fetchStudentsBySemester(semester);
      showMessage('Student deleted successfully!', true);
    } catch (err) {
      console.error('Error deleting student:', err);
      showMessage('Error deleting student!', false);
    }
  };

  const handleCSVUpload = async (file) => {
    if (!file) {
      showMessage('Please select a file first!', false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const response = await axios.post(
        'http://localhost:7070/students/upload', 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 10000
        }
      );

      if (response.data.success) {
        const uploadedSession = response.data.session;
        setFilterSession(uploadedSession);
        showMessage(
          `CSV uploaded successfully! ${response.data.count} students added. Session: ${uploadedSession}`,
          true
        );
        
        for (let i = 1; i <= 8; i++) {
          await fetchStudentsBySemester(i);
        }
        setVisibleSemester(1);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to upload CSV. Please check the file format.';
      showMessage(errorMsg, false);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const downloadTemplate = (sem) => {
    const headers = ['name', 'rollNo', 'semester', 'session', 'training'];
    
    // Use simple subject names without codes for CSV headers
    subjects[sem].forEach(sub => {
      // Extract just the subject name without code (e.g., "Mathematics" from "BT-101 - Engineering Mathematics")
      const subjectName = sub.split(' - ')[1] || sub;
      headers.push(`${subjectName}.mid1`);
      headers.push(`${subjectName}.mid2`);
      headers.push(`${subjectName}.assignment`);
    });
    
    const sampleData = [
      'shubham  raj', 
      `CS${new Date().getFullYear()}${sem.toString().padStart(3, '0')}`, 
      sem, 
      `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      '85'
    ];
    
    // Add sample marks for each subject
    subjects[sem].forEach(() => {
      sampleData.push('15'); // mid1
      sampleData.push('25'); // mid2  
      sampleData.push('8');  // assignment
    });
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `semester_${sem}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      const isPass = s.subjects && s.subjects.length > 0
        ? s.subjects.every(subject => {
            const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
            return totalMarks >= 40;
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
          const isPass = s.subjects && s.subjects.length > 0
            ? s.subjects.every(subject => {
                const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
                return totalMarks >= 40;
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      showMessage('Please upload a valid CSV file', false);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (subject, marks) => {
    setFormData(prev => ({
      ...prev,
      grades: { ...prev.grades, [subject]: marks }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  Department of Computer Science
                </h1>
                <p className="text-sm mt-1 text-blue-200">
                  Student Management System
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

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
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

          <div className="mb-8 text-center grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={analyzePerformance}
            >
              <i className="fas fa-chart-line mr-2"></i> View Top Performers & Slow Learners
            </button>
            <button 
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={generateComprehensiveReport}
            >
              <i className="fas fa-file-alt mr-2"></i> Generate Complete Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Upload Students via CSV</h3>
              
              <div className="space-y-4">
                <label className="block bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center cursor-pointer hover:bg-white/20 transition-all duration-200">
                  {selectedFile ? selectedFile.name : 'Choose CSV File'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                
                <button
                  type="button"
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    !selectedFile || isUploading
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                  onClick={() => handleCSVUpload(selectedFile)}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload CSV'}
                </button>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4 text-center">Download Semester-wise CSV Templates</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(8)].map((_, i) => {
                    const sem = i + 1;
                    return (
                      <button 
                        type="button" 
                        key={sem} 
                        onClick={() => downloadTemplate(sem)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg border border-white/20 transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Sem {sem}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Add Student Manually</h3>
              
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Student Name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required 
                  />
                  <input 
                    type="text" 
                    name="rollNo"
                    placeholder="Roll Number" 
                    value={formData.rollNo} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required 
                  />
                  <select 
                    name="semester"
                    value={formData.semester} 
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, grades: {} }));
                    }} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="" className="text-gray-800">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="text-gray-800">Semester {i + 1}</option>
                    ))}
                  </select>
                  <select 
                    name="session"
                    value={formData.session} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="" className="text-gray-800">Select Session</option>
                    <option value="2022-2023" className="text-gray-800">2022-2023</option>
                    <option value="2023-2024" className="text-gray-800">2023-2024</option>
                    <option value="2024-2025" className="text-gray-800">2024-2025</option>
                    <option value="2025-2026" className="text-gray-800">2025-2026</option>
                  </select>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <label className="block text-white mb-2 text-sm font-medium">Training Marks (Max 100)</label>
                  <input 
                    type="number"
                    name="training"
                    placeholder="Enter Training Marks"
                    min="0"
                    max="100"
                    value={formData.training}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
                </div>

                {formData.semester && subjects[formData.semester] && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Subject Marks (RGPV Format)</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {subjects[formData.semester].map((sub) => (
                        <div key={sub} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <label className="block text-white mb-2 text-sm font-medium">{sub}</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input 
                              type="number"
                              placeholder="MST1 (Max 28)"
                              min="0"
                              max="28"
                              value={formData.grades[sub]?.mid1 || ''}
                              onChange={(e) => handleGradeChange(sub, { 
                                ...formData.grades[sub], 
                                mid1: parseInt(e.target.value) || 0 
                              })}
                              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                              required
                            />
                            <input 
                              type="number"
                              placeholder="MST2 (Max 42)"
                              min="0"
                              max="42"
                              value={formData.grades[sub]?.mid2 || ''}
                              onChange={(e) => handleGradeChange(sub, { 
                                ...formData.grades[sub], 
                                mid2: parseInt(e.target.value) || 0 
                              })}
                              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                              required
                            />
                            <input 
                              type="number"
                              placeholder="Assignment (Max 10)"
                              min="0"
                              max="10"
                              value={formData.grades[sub]?.assignment || ''}
                              onChange={(e) => handleGradeChange(sub, { 
                                ...formData.grades[sub], 
                                assignment: parseInt(e.target.value) || 0 
                              })}
                              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!formData.semester && (
                  <div className="text-center py-8 text-white/70">
                    <span className="text-2xl">📌</span>
                    <p className="mt-2">Select semester to enter marks</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isAdding}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isAdding 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {isAdding ? 'Adding...' : 'Add Student'}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Filter by Session</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <select 
                value={filterSession} 
                onChange={(e) => setFilterSession(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-48"
              >
                <option value="" className="text-gray-800">-- Select Session --</option>
                <option value="2022-2023" className="text-gray-800">2022-2023</option>
                <option value="2023-2024" className="text-gray-800">2023-2024</option>
                <option value="2024-2025" className="text-gray-800">2024-2025</option>
                <option value="2025-2026" className="text-gray-800">2025-2026</option>
              </select>
              {filterSession && (
                <p className="text-blue-200 font-semibold">Currently viewing: {filterSession}</p>
              )}
            </div>
          </div>

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

          {visibleSemester && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Semester {visibleSemester} - Session: {filterSession || 'All'}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-4">Student List</h4>
                  <div className="max-h-96 overflow-y-auto">
                    {semesterWiseStudents[visibleSemester]?.length > 0 ? (
                      <table className="w-full text-white">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Roll No</th>
                            <th className="py-3 px-4 text-left">Training</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semesterWiseStudents[visibleSemester]?.map((s) => {
                            const isPass = s.subjects && s.subjects.length > 0
                              ? s.subjects.every(subject => {
                                  const totalMarks = (subject.mid1 || 0) + (subject.mid2 || 0) + (subject.assignment || 0);
                                  return totalMarks >= 40;
                                }) 
                              : false;
                            return (
                              <tr key={s.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="py-3 px-4">{s.name}</td>
                                <td className="py-3 px-4 font-mono">{s.rollNo}</td>
                                <td className="py-3 px-4 font-mono">{s.training || '0'}</td>
                                <td className={`py-3 px-4 font-semibold ${
                                  isPass ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {isPass ? 'Pass' : 'Fail'}
                                </td>
                                <td className="py-3 px-4">
                                  <button 
                                    onClick={() => handleDeleteStudent(s.id, visibleSemester)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg border border-red-400/50 transition-all duration-200 hover:scale-105"
                                  >
                                    Delete
                                  </button>
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
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-4">Semester Performance</h4>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut 
                      data={prepareChartData(semesterWiseStudents[visibleSemester])} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {filterSession && (
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
                      title: { display: true, text: 'Pass/Fail by Year' }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showPerformanceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPerformanceModal(false)}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
          [&::-webkit-scrollbar]:w-0
          [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
       dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Performance Analysis - Session: {filterSession}</h2>
                <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowPerformanceModal(false)}>
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-white/70">No data available</div>
                )}
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Students Needing Attention</h3>
                {slowLearners.length > 0 ? (
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Roll No</th>
                        <th className="py-3 px-4 text-left">Semester</th>
                        <th className="py-3 px-4 text-left">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slowLearners.map((student, index) => (
                        <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                          <td className="py-3 px-4">Semester {student.semester}</td>
                          <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-white/70">No data available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportModal && comprehensiveReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto
        [&::-webkit-scrollbar]:w-0
          [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
       dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-50
       
          " onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Comprehensive Academic Report - {comprehensiveReport.session}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={printReport}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    🖨️ Print Report
                  </button>
                  
                  <button 
                    onClick={downloadReportAsImage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    📊 Download Data
                  </button>
                  
                  <button className="text-white hover:text-gray-300 text-2xl" onClick={() => setShowReportModal(false)}>
                    &times;
                  </button>
                </div>
              </div>
              <p className="text-blue-200 mt-2">Generated on: {comprehensiveReport.generatedAt}</p>
            </div>
            
            <div ref={reportRef} className="p-6 space-y-8 bg-gradient-to-br from-blue-900 to-indigo-800">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Department of Computer Science</h1>
                <h2 className="text-2xl font-semibold text-blue-200 mb-4">Academic Performance Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
                  <div>Session: <span className="font-bold">{comprehensiveReport.session}</span></div>
                  <div>Generated On: <span className="font-bold">{comprehensiveReport.generatedAt}</span></div>
                  <div>Total Students: <span className="font-bold">
                    {Object.values(comprehensiveReport.semesterWise).reduce((sum, sem) => sum + sem.totalStudents, 0)}
                  </span></div>
                  <div>Total Failed: <span className="font-bold text-red-400">
                    {comprehensiveReport.allFailedStudents.length}
                  </span></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance Charts</h3>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">Semester-wise Pass/Fail Distribution</h4>
                  <div className="h-64">
                    <Bar 
                      data={comprehensiveReport.semesterChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">Performance Trend Across Semesters</h4>
                  <div className="h-64">
                    <Line 
                      data={comprehensiveReport.trendChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Percentage'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">Annual Performance Summary</h4>
                  <div className="h-64">
                    <Bar 
                      data={comprehensiveReport.annualChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Semester-wise Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <div key={sem} className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h4 className="font-bold text-white text-center mb-2">Semester {sem}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Students:</span>
                          <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.totalStudents || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passed:</span>
                          <span className="text-green-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.passed || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Failed:</span>
                          <span className="text-red-400 font-semibold">{comprehensiveReport.semesterWise[sem]?.failed || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pass %:</span>
                          <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.passPercentage || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg %:</span>
                          <span className="font-semibold">{comprehensiveReport.semesterWise[sem]?.averagePercentage || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Annual Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <div key={year} className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h4 className="font-bold text-white text-center mb-2">{year}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Students:</span>
                          <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.totalStudents || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passed:</span>
                          <span className="text-green-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalPassed || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Failed:</span>
                          <span className="text-red-400 font-semibold">{comprehensiveReport.annualSummary[year]?.totalFailed || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pass %:</span>
                          <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.passPercentage || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg %:</span>
                          <span className="font-semibold">{comprehensiveReport.annualSummary[year]?.averagePercentage || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Top 10 Performers (Overall)</h3>
                {comprehensiveReport.topPerformers.length > 0 ? (
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4 text-left">Rank</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Roll No</th>
                        <th className="py-3 px-4 text-left">Semester</th>
                        <th className="py-3 px-4 text-left">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprehensiveReport.topPerformers.map((student, index) => (
                        <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 font-bold">{index + 1}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                          <td className="py-3 px-4">Semester {student.semester}</td>
                          <td className="py-3 px-4 font-bold text-green-400">{student.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-white/70">No data available</div>
                )}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Students Needing Attention (Slow Learners)</h3>
                {comprehensiveReport.slowLearners.length > 0 ? (
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Roll No</th>
                        <th className="py-3 px-4 text-left">Semester</th>
                        <th className="py-3 px-4 text-left">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprehensiveReport.slowLearners.map((student, index) => (
                        <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                          <td className="py-3 px-4">Semester {student.semester}</td>
                          <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-white/70">No data available</div>
                )}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">All Failed Students ({comprehensiveReport.allFailedStudents.length} Students)</h3>
                {comprehensiveReport.allFailedStudents.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-3 px-4 text-left">S.No.</th>
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Roll No</th>
                          <th className="py-3 px-4 text-left">Semester</th>
                          <th className="py-3 px-4 text-left">Percentage</th>
                          <th className="py-3 px-4 text-left">Session</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comprehensiveReport.allFailedStudents.map((student, index) => (
                          <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                            <td className="py-3 px-4">Semester {student.semester}</td>
                            <td className="py-3 px-4 font-bold text-red-400">{student.percentage.toFixed(2)}%</td>
                            <td className="py-3 px-4">{student.session}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/70">
                    <div className="text-4xl mb-2">🎉</div>
                    <p>No failed students found for this session!</p>
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

export default ComputerScience;

