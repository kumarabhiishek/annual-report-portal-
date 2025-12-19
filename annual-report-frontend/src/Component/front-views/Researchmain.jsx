import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FiPlus,
  FiMoon,
  FiSun,
  FiBook,
  FiDollarSign,
  FiBarChart2,
  FiSearch,
  FiUsers,
  FiCalendar,
  FiX,
  FiSave,
  FiTrendingUp,
  FiRefreshCw
} from "react-icons/fi";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

// API base URL
const API_BASE_URL = 'http://localhost:7070/research';

// API service functions
const researchAPI = {
  // Get all projects
  getAllProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return await response.json();
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return await response.json();
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return await response.json();
  },

  // Search projects
  searchProjects: async (searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/projects/search?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Failed to search projects');
    return await response.json();
  },

  // Get statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return await response.json();
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  }
};

const Researchmain = () => {
  const [researchProjects, setResearchProjects] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [researchData, setResearchData] = useState({
    projectName: "",
    principalInvestigator: "",
    publicationYear: "",
    fundingAmount: "",
    researchDomain: "",
    status: "ongoing"
  });

  // Load projects from backend on component mount
  useEffect(() => {
    checkApiConnection();
    loadProjects();
  }, []);

  // Check if backend API is connected
  const checkApiConnection = async () => {
    try {
      const isHealthy = await researchAPI.healthCheck();
      setApiConnected(isHealthy);
    } catch (error) {
      console.error('API connection failed:', error);
      setApiConnected(false);
    }
  };

  // Load projects from backend
  const loadProjects = async () => {
    setLoading(true);
    try {
      const projects = await researchAPI.getAllProjects();
      setResearchProjects(projects);
      setApiConnected(true);
    } catch (error) {
      console.error('Error loading projects:', error);
      setApiConnected(false);
      // Fallback: show empty state
      setResearchProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dark mode - FIXED
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter projects based on search and filter
  const filteredProjects = useMemo(() => {
    return researchProjects.filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeFilter === "all") return matchesSearch;
      return matchesSearch && project.status === activeFilter;
    });
  }, [researchProjects, searchTerm, activeFilter]);

  // Pie chart data
  const chartData = useMemo(() => {
    const yearCount = {};
    researchProjects.forEach((project) => {
      yearCount[project.publicationYear] = (yearCount[project.publicationYear] || 0) + 1;
    });
    return Object.keys(yearCount).map((year) => ({
      name: year,
      value: yearCount[year],
    }));
  }, [researchProjects]);

  // Researchmain statistics
  const researchStats = useMemo(() => {
    const totalFunding = researchProjects.reduce((sum, project) => 
      sum + (parseFloat(project.fundingAmount) || 0), 0
    );
    
    const completedProjects = researchProjects.filter(project => 
      project.status === 'completed'
    ).length;

    const ongoingProjects = researchProjects.filter(project => 
      project.status === 'ongoing'
    ).length;

    return {
      totalProjects: researchProjects.length,
      completedProjects,
      ongoingProjects,
      totalFunding: totalFunding.toFixed(2)
    };
  }, [researchProjects]);

  // handle input change
  const handleInputChange = (e) => {
    setResearchData({ ...researchData, [e.target.name]: e.target.value });
  };

  // save project to backend
  const saveResearchProject = async (e) => {
    e.preventDefault();
    if (!researchData.projectName || !researchData.principalInvestigator || !researchData.publicationYear) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const projectToSave = {
        ...researchData,
        publicationYear: parseInt(researchData.publicationYear),
        fundingAmount: researchData.fundingAmount ? parseFloat(researchData.fundingAmount) : null
      };

      await researchAPI.createProject(projectToSave);
      
      // Reload projects from backend
      await loadProjects();
      
      // Reset form
      setResearchData({ 
        projectName: "", 
        principalInvestigator: "", 
        publicationYear: "",
        fundingAmount: "",
        researchDomain: "",
        status: "ongoing"
      });
      setDisplayForm(false);
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // cancel form
  const cancelForm = () => {
    setResearchData({ 
      projectName: "", 
      principalInvestigator: "", 
      publicationYear: "",
      fundingAmount: "",
      researchDomain: "",
      status: "ongoing"
    });
    setDisplayForm(false);
  };

  // Refresh data
  const handleRefresh = () => {
    loadProjects();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-6">
        {!displayForm ? (
          <>
            {/* Header Section */}
            <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 rounded-2xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <FiTrendingUp className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Research Analytics Dashboard
                  </h1>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Monitor research initiatives and track progress metrics
                    {!apiConnected && (
                      <span className="ml-2 text-red-500 text-sm">(Backend Offline - Using Local Data)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  />
                </div>
                
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`p-3 rounded-lg hover:bg-gray-200 transition-colors shadow-md disabled:opacity-50 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Refresh data"
                >
                  <FiRefreshCw className={`text-xl ${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <button 
                  onClick={toggleDarkMode}
                  className={`p-3 rounded-lg hover:bg-gray-200 transition-colors shadow-md ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-2xl p-6 shadow-lg border-l-4 border-blue-500 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Projects</p>
                    <h3 className="text-3xl font-bold mt-2">{researchStats.totalProjects}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    darkMode ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <FiBook className={`text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                <div className={`flex items-center mt-4 text-sm ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  <FiTrendingUp className="mr-1" />
                  <span>{researchStats.ongoingProjects} ongoing</span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border-l-4 border-green-500 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
                    <h3 className="text-3xl font-bold mt-2">{researchStats.completedProjects}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    darkMode ? 'bg-green-900' : 'bg-green-100'
                  }`}>
                    <FiBarChart2 className={`text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                <div className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Research completed
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Publications</p>
                    <h3 className="text-3xl font-bold mt-2">8</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                  }`}>
                    <FiUsers className={`text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                </div>
                <div className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Peer-reviewed papers
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border-l-4 border-purple-500 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Funding</p>
                    <h3 className="text-3xl font-bold mt-2">₹{researchStats.totalFunding}Cr</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    darkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <FiDollarSign className={`text-2xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                </div>
                <div className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Research grants
                </div>
              </div>
            </div>

            {/* Charts and Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className={`rounded-2xl p-6 shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Project Distribution by Year</h2>
                  <FiCalendar className="text-gray-400" />
                </div>
                {researchProjects.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`segment-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={`flex flex-col items-center justify-center h-64 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <FiBarChart2 className="text-4xl mb-4 opacity-50" />
                    <p>No research data available</p>
                    <p className="text-sm mt-2">Add projects to see visualization</p>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className="text-xl font-semibold mb-6">Research Overview</h2>
                <div className="space-y-4">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <span className="font-medium">Active Projects</span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {researchStats.ongoingProjects}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <span className="font-medium">Completed Projects</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {researchStats.completedProjects}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
                  }`}>
                    <span className="font-medium">Research Domains</span>
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      {new Set(researchProjects.map(p => p.researchDomain)).size}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
                  }`}>
                    <span className="font-medium">Principal Investigators</span>
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                      {new Set(researchProjects.map(p => p.principalInvestigator)).size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Research Projects Table */}
            <div className={`rounded-2xl shadow-lg overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-6 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold">Research Portfolio</h2>
                    <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Manage and track all research projects
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setActiveFilter("all")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === "all" 
                            ? "bg-blue-500 text-white" 
                            : darkMode 
                              ? "bg-gray-700 text-gray-300" 
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setActiveFilter("ongoing")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === "ongoing" 
                            ? "bg-yellow-500 text-white" 
                            : darkMode 
                              ? "bg-gray-700 text-gray-300" 
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        Ongoing
                      </button>
                      <button 
                        onClick={() => setActiveFilter("completed")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === "completed" 
                            ? "bg-green-500 text-white" 
                            : darkMode 
                              ? "bg-gray-700 text-gray-300" 
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setDisplayForm(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      <FiPlus className="text-lg" />
                      <span>New Project</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Project
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Lead Researcher
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Year
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Domain
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    darkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className={`flex flex-col items-center ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <FiRefreshCw className="text-4xl mb-4 animate-spin" />
                            <p>Loading research projects...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className={`flex flex-col items-center ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <FiBook className="text-4xl mb-4 opacity-50" />
                            <p className="text-lg">No research projects found</p>
                            <p className="text-sm mt-2">
                              {researchProjects.length === 0 
                                ? "Get started by adding your first research project" 
                                : "Try adjusting your search or filter criteria"}
                            </p>
                            {researchProjects.length === 0 && (
                              <button 
                                onClick={() => setDisplayForm(true)}
                                className="mt-4 flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <FiPlus />
                                <span>Add First Project</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project, index) => (
                        <tr key={project.projectId} className={`transition-colors ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}>
                          <td className="px-6 py-4">
                            <div>
                              <p className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.projectName}
                              </p>
                              {project.fundingAmount && (
                                <p className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  ₹{project.fundingAmount} Cr
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                darkMode ? 'bg-blue-900' : 'bg-blue-100'
                              }`}>
                                <FiUsers className={`text-sm ${
                                  darkMode ? 'text-blue-400' : 'text-blue-600'
                                }`} />
                              </div>
                              {project.principalInvestigator}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              darkMode 
                                ? 'bg-blue-900 text-blue-200' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {project.publicationYear}
                            </span>
                          </td>
                          <td className={`px-6 py-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {project.researchDomain || "Not specified"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'completed' 
                                ? darkMode
                                  ? 'bg-green-900 text-green-200'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                  ? 'bg-yellow-900 text-yellow-200'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // Project Submission Form
          <div className="max-w-2xl mx-auto">
            <div className={`rounded-2xl shadow-lg p-8 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Register New Research Project</h2>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Add details about your research initiative
                  </p>
                </div>
                <button 
                  onClick={cancelForm}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <form className="space-y-6" onSubmit={saveResearchProject}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      placeholder="Enter research project title"
                      value={researchData.projectName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Principal Investigator *
                    </label>
                    <input
                      type="text"
                      name="principalInvestigator"
                      placeholder="Enter principal investigator name"
                      value={researchData.principalInvestigator}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Publication Year *
                    </label>
                    <input
                      type="number"
                      name="publicationYear"
                      placeholder="YYYY"
                      min="2000"
                      max="2030"
                      value={researchData.publicationYear}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Funding Amount (Cr)
                    </label>
                    <input
                      type="number"
                      name="fundingAmount"
                      placeholder="Enter funding amount"
                      step="0.01"
                      value={researchData.fundingAmount}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Research Domain
                    </label>
                    <select
                      name="researchDomain"
                      value={researchData.researchDomain}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="">Select Domain</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Environmental Science">Environmental Science</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Project Status
                    </label>
                    <select
                      name="status"
                      value={researchData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button 
                    type="button" 
                    onClick={cancelForm}
                    className={`px-6 py-3 border rounded-lg transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <FiRefreshCw className="text-lg animate-spin" />
                    ) : (
                      <FiSave className="text-lg" />
                    )}
                    <span>{loading ? 'Saving...' : 'Save Research Project'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Researchmain;