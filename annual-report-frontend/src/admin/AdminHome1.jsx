import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';

const AdminHome1 = () => {
  const [mainCategory, setMainCategory] = useState('');
  const [optionType, setOptionType] = useState('');
  const [subOption, setSubOption] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    department: '',
    email: '',
    role: 'faculty',
    password: ''
  });
  const [generatedId, setGeneratedId] = useState('');
  const [facultyList, setFacultyList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFacultyList();
  }, []);

  const fetchFacultyList = async () => {
    try {
      const res = await axios.get('http://localhost:7070/api/faculty/all');
      setFacultyList(res.data);
    } catch (err) {
      console.error('Error fetching faculty:', err);
    }
  };

  const handleCategorySelection = (mainCat, type) => {
    setMainCategory(mainCat);
    setOptionType(type);
    setSubOption('');
    setSelectedBranch('');
    if (mainCat === 'Research' && type === 'Department') {
      navigate('/researchad');
    }else if (mainCat === 'Research' && type === 'Student Placement') {
    navigate('/publication');
    }
    if (mainCat === 'Finance' && type === 'Department') {
      navigate('/finance/budgetallocation');
    }
    if (mainCat === 'Finance' && type === 'Expense') {
      navigate('/expensesummary');
    }
    if (mainCat === 'Finance' && type === 'Fee') {
      navigate('/feescholer');
    }

    if (mainCat === 'Academics' && type === 'Student Placement') {
      navigate('/placementhero');
    }
  };

  const handleOptionSelection = (option, e) => {
    e.preventDefault();
    setSubOption(option);
    setSelectedBranch('');
    if (option === 'Mechanical Engineering') navigate('/mechanical');
    else if (option === 'Computer Science') navigate('/computer-science');
    else if (option === 'Electrical Engineering') navigate('/electrical');
    else if (option === 'Civil Engineering') navigate('/civil');
  };

  const handleFacultyInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty(prev => ({ ...prev, [name]: value }));
  };

  const generateFacultyId = async (e) => {
    e.preventDefault();
    if (!newFaculty.password) {
      alert("Please enter a password");
      return;
    }
    if (!newFaculty.name || !newFaculty.email || !newFaculty.department) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post('http://localhost:7070/api/faculty/add', newFaculty);
      const savedFaculty = res.data;
      setGeneratedId(savedFaculty.generatedId);
      setFacultyList([...facultyList, savedFaculty]);
      setNewFaculty({ name: '', department: '', email: '', role: 'faculty', password: '' });
      alert(`Login ID generated: ${savedFaculty.generatedId}`);
    } catch (err) {
      console.error('Error saving faculty:', err);
      alert('Failed to save faculty. Check backend server.');
    }
  };

  const deleteFaculty = async (generatedId) => {
    if (!window.confirm(`Are you sure you want to delete faculty with ID ${generatedId}?`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:7070/api/faculty/delete-by-generatedId/${generatedId}`);
      setFacultyList(facultyList.filter(faculty => faculty.generatedId !== generatedId));
      alert(`Faculty ${generatedId} deleted successfully.`);
    } catch (err) {
      console.error('Error deleting faculty:', err);
      alert('Failed to delete faculty.');
    }
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
                <span className="text-blue-700 font-bold text-lg">Admin</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  Admin Panel
                </h1>
              </div>
            </div>
            <div className="flex gap-4">
              <Link 
                to="/" 
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-24 w-full z-40 bg-white/5 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-start gap-6">
            {!mainCategory && (
              <>
                {/* Finance Dropdown */}
                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
                    Finance
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2">
                      <a 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          handleCategorySelection('Finance', 'Department'); 
                        }}
                        className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200"
                      >
                        Budget Allocation & Utilization
                      </a>
                    
                    </div>
                  </div>
                </div>

                {/* Research Dropdown */}
                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
                    Research
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Research', 'Department'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Research Projects
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Research', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Publications
                      </a>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Dropdown */}
                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
                    Infrastructure
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Infrastructure', 'Department'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Lab Detail
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Infrastructure', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Classroom
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Infrastructure', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Library
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Infrastructure', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Hostel and Sports Facility
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Infrastructure', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Maintenance Report
                      </a>
                    </div>
                  </div>
                </div>

                {/* Academics Dropdown */}
                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
                    Academics
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Academics', 'Department'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Department
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelection('Academics', 'Student Placement'); }} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                        Student Placement
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}

            {optionType === 'Department' && (
              <div className="relative group">
                <button className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium backdrop-blur-sm border border-white/30">
                  Select Department
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50">
                  <div className="p-2">
                    <a href="#" onClick={(e) => handleOptionSelection('Computer Science', e)} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                      Computer Science
                    </a>
                    <a href="#" onClick={(e) => handleOptionSelection('Mechanical Engineering', e)} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                      Mechanical Engineering
                    </a>
                    <a href="#" onClick={(e) => handleOptionSelection('Electrical Engineering', e)} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                      Electrical Engineering
                    </a>
                    <a href="#" onClick={(e) => handleOptionSelection('Civil Engineering', e)} className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200">
                      Civil Engineering
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Faculty Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Faculty Login ID Generator</h2>
              <form onSubmit={generateFacultyId} className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-medium">Name:</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newFaculty.name} 
                    onChange={handleFacultyInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter faculty name"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Department:</label>
                  <select 
                    name="department" 
                    value={newFaculty.department} 
                    onChange={handleFacultyInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="" className="text-gray-800">Select Department</option>
                    <option value="Computer Science" className="text-gray-800">Computer Science</option>
                    <option value="Mechanical Engineering" className="text-gray-800">Mechanical Engineering</option>
                    <option value="Electrical Engineering" className="text-gray-800">Electrical Engineering</option>
                    <option value="Civil Engineering" className="text-gray-800">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Email:</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={newFaculty.email} 
                    onChange={handleFacultyInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter email address"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Role:</label>
                  <select 
                    name="role" 
                    value={newFaculty.role} 
                    onChange={handleFacultyInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="faculty" className="text-gray-800">Faculty</option>
                    <option value="admin" className="text-gray-800">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Password:</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={newFaculty.password} 
                    onChange={handleFacultyInputChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter password"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Generate Faculty ID
                </button>
              </form>

              {generatedId && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-400/50 rounded-xl text-green-200 text-center">
                  <strong>Faculty ID Generated:</strong> {generatedId}
                </div>
              )}
            </div>

            {/* Faculty List */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Existing Faculty</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Department</th>
                      <th className="py-3 px-4 text-left">Faculty ID</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Password</th>
                      <th className="py-3 px-4 text-left">Date Added</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyList.map((faculty) => (
                      <tr key={faculty.generatedId} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{faculty.name}</td>
                        <td className="py-3 px-4">{faculty.department}</td>
                        <td className="py-3 px-4 font-mono">{faculty.generatedId}</td>
                        <td className="py-3 px-4">{faculty.email}</td>
                        <td className="py-3 px-4 font-mono text-sm">{faculty.password}</td>
                        <td className="py-3 px-4">
                          {faculty.dateAdded ? new Date(faculty.dateAdded).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteFaculty(faculty.generatedId)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg border border-red-400/50 transition-all duration-200 hover:scale-105"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {facultyList.length === 0 && (
                  <div className="text-center py-8 text-white/70">
                    No faculty members found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-blue-200">
            &copy; 2025 Institute Annual Report Portal 
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminHome1;