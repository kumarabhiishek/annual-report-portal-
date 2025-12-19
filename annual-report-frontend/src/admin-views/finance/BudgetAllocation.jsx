import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const API_BASE_URL = "http://localhost:7070/api/budget";

export default function BudgetAllocation() {
  const [form, setForm] = useState({ year: new Date().getFullYear(), dept: "Engineering", allocated: "", utilized: "", project: "" });
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [loading, setLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableDepts, setAvailableDepts] = useState([]);
  
  const depts = ["Science", "Engineering", "Arts", "Commerce", "Special Projects", "Research"];

  // Fetch records from backend
  useEffect(() => {
    fetchRecords();
    fetchFilters();
  }, []);

  async function fetchRecords() {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Error loading budget records. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilters() {
    try {
      const response = await fetch(`${API_BASE_URL}/filters`);
      if (response.ok) {
        const filters = await response.json();
        setAvailableYears(filters.years || []);
        setAvailableDepts(filters.departments || []);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  }

  function handleChange(e) { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
  }
  
  async function addRecord(e) {
    e.preventDefault();
    if (!form.allocated) { 
      alert("Allocated amount required"); 
      return; 
    }

    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: Number(form.year),
          dept: form.dept,
          allocated: Number(form.allocated),
          utilized: Number(form.utilized || 0),
          project: form.project || ""
        })
      });
      
      if (!response.ok) throw new Error('Failed to add record');
      
      await fetchRecords(); // Refresh the list
      setForm({ year: new Date().getFullYear(), dept: "Engineering", allocated: "", utilized: "", project: "" });
      alert("Budget record added successfully!");
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Error adding budget record. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  async function deleteRecord(id) { 
    if (!window.confirm("Delete this budget record?")) return; 
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error('Failed to delete record');
      
      await fetchRecords(); // Refresh the list
      alert("Budget record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting budget record. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Filter records locally (or you can implement server-side filtering)
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.project?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "all" || record.year.toString() === filterYear;
    const matchesDept = filterDept === "all" || record.dept === filterDept;
    
    return matchesSearch && matchesYear && matchesDept;
  });

  // Get unique years for filter (fallback to local calculation)
  const years = availableYears.length > 0 ? availableYears : [...new Set(records.map(r => r.year))].sort((a, b) => b - a);

  // Charts data
  const labels = filteredRecords.map(r => `${r.dept} (${r.year})`);
  const allocatedArr = filteredRecords.map(r => r.allocated);
  const utilizedArr = filteredRecords.map(r => r.utilized);
  
  const barData = { 
    labels, 
    datasets: [ 
      { 
        label: "Allocated", 
        data: allocatedArr, 
        backgroundColor: "#6366f1",
        borderColor: "#4f46e5",
        borderWidth: 1
      }, 
      { 
        label: "Utilized", 
        data: utilizedArr, 
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1
      } 
    ] 
  };

  const totalAllocated = filteredRecords.reduce((s, r) => s + r.allocated, 0);
  const totalUtilized = filteredRecords.reduce((s, r) => s + r.utilized, 0);
  const remaining = totalAllocated - totalUtilized;
  
  const doughData = { 
    labels: ["Allocated", "Utilized", "Remaining"], 
    datasets: [{
      data: [totalAllocated, totalUtilized, remaining], 
      backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
      borderColor: ["#4f46e5", "#059669", "#d97706"],
      borderWidth: 2,
      hoverOffset: 15
    }] 
  };

  // Calculate utilization percentage
  const utilizationPercentage = totalAllocated > 0 ? (totalUtilized / totalAllocated * 100).toFixed(1) : 0;

  // Export function
  function exportCSV() {
    const header = ["Year", "Department", "Allocated", "Utilized", "Remaining", "Project"];
    const rows = filteredRecords.map(r => [r.year, r.dept, r.allocated, r.utilized, r.allocated - r.utilized, r.project]);
    const csv = [header, ...rows].map(r => r.map(c => `"${("" + c).replace(/"/g, '""')}"`).join(",")).join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "budget_allocation.csv");
  }

  // Server-side search function (optional - you can use this instead of local filtering)
  async function handleSearch() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterYear !== "all") params.append('year', filterYear);
      if (filterDept !== "all") params.append('dept', filterDept);
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await fetch(`${API_BASE_URL}/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records);
        // You can also use data.summary for the summary if needed
      }
    } catch (error) {
      console.error("Error searching records:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Budget Allocation & Utilization Dashboard</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Manage and track budget allocations across departments with real-time visualization</p>
          {loading && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10 w-fit mx-auto">
          <div className="flex space-x-1">
            {["overview", "add", "table"].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                onClick={() => setActiveTab(tab)}
                disabled={loading}
              >
                {tab === "overview" && "Overview"}
                {tab === "add" && "Add Budget"}
                {tab === "table" && "Data Table"}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100">Total Allocated</p>
                    <h3 className="text-3xl font-bold mt-2">₹{totalAllocated.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Total Utilized</p>
                    <h3 className="text-3xl font-bold mt-2">₹{totalUtilized.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100">Remaining Balance</p>
                    <h3 className="text-3xl font-bold mt-2">₹{remaining.toLocaleString()}</h3>
                    <p className="text-amber-100 mt-2">{utilizationPercentage}% utilized</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department-wise Allocation vs Utilization */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Department-wise Budget</h3>
                  <span className="text-slate-300 text-sm">{filteredRecords.length} records</span>
                </div>
                <div className="h-80">
                  <Bar 
                    data={barData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#e2e8f0',
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          titleColor: '#e2e8f0',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 1
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: '#94a3b8',
                            maxRotation: 45
                          },
                          grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                          }
                        },
                        y: {
                          ticks: {
                            color: '#94a3b8'
                          },
                          grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Allocation Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Budget Distribution</h3>
                <div className="h-64 mb-6">
                  <Doughnut 
                    data={doughData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#e2e8f0',
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          titleColor: '#e2e8f0',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 1,
                          callbacks: {
                            label: function(context) {
                              const value = context.parsed;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `₹${value.toLocaleString()} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-3 text-white">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                      <span>Allocated</span>
                    </div>
                    <span className="font-semibold">₹{totalAllocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                      <span>Utilized</span>
                    </div>
                    <span className="font-semibold">₹{totalUtilized.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                      <span>Remaining</span>
                    </div>
                    <span className="font-semibold">₹{remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Budget Tab */}
        {activeTab === "add" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-2">Add New Budget Allocation</h3>
              <p className="text-slate-300 mb-6">Enter the details for the new budget allocation below</p>
              
              <form onSubmit={addRecord} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Year</label>
                    <input 
                      type="number" 
                      name="year" 
                      value={form.year} 
                      onChange={handleChange} 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Department</label>
                    <select 
                      name="dept" 
                      value={form.dept} 
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      disabled={loading}
                    >
                      {depts.map(d => <option key={d} value={d} className="text-gray-800">{d}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Allocated Amount <span className="text-red-400">*</span></label>
                    <input 
                      name="allocated" 
                      type="number" 
                      placeholder="Enter allocated amount" 
                      value={form.allocated} 
                      onChange={handleChange} 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Utilized Amount</label>
                    <input 
                      name="utilized" 
                      type="number" 
                      placeholder="Enter utilized amount" 
                      value={form.utilized} 
                      onChange={handleChange} 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Project Name</label>
                  <input 
                    name="project" 
                    placeholder="Enter project name (optional)" 
                    value={form.project} 
                    onChange={handleChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Budget Allocation
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setForm({ year: new Date().getFullYear(), dept: "Engineering", allocated: "", utilized: "", project: "" })}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Table Tab */}
        {activeTab === "table" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Budget Records</h3>
                <p className="text-slate-300 mt-1">{filteredRecords.length} of {records.length} records</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search projects or departments..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 transition-all duration-300"
                    disabled={loading}
                  />
                  <svg className="w-5 h-5 text-white/70 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  disabled={loading}
                >
                  <option value="all" className="text-gray-800">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year} className="text-gray-800">{year}</option>
                  ))}
                </select>
                
                <select 
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  disabled={loading}
                >
                  <option value="all" className="text-gray-800">All Departments</option>
                  {depts.map(dept => (
                    <option key={dept} value={dept} className="text-gray-800">{dept}</option>
                  ))}
                </select>
                
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={exportCSV}
                  disabled={loading || filteredRecords.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>

                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="py-4 px-4 text-left font-semibold">Year</th>
                    <th className="py-4 px-4 text-left font-semibold">Department</th>
                    <th className="py-4 px-4 text-left font-semibold">Allocated</th>
                    <th className="py-4 px-4 text-left font-semibold">Utilized</th>
                    <th className="py-4 px-4 text-left font-semibold">Remaining</th>
                    <th className="py-4 px-4 text-left font-semibold">Project</th>
                    <th className="py-4 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice().reverse().map(r => (
                    <tr key={r.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <span className="bg-white/10 px-3 py-1 rounded-lg font-medium">
                          {r.year}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-200 rounded-lg text-sm font-medium border border-indigo-500/30">
                          {r.dept}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-blue-300">₹{r.allocated.toLocaleString()}</td>
                      <td className="py-4 px-4 font-semibold text-emerald-300">₹{r.utilized.toLocaleString()}</td>
                      <td className={`py-4 px-4 font-semibold ${
                        (r.allocated - r.utilized) >= 0 ? 'text-amber-300' : 'text-red-300'
                      }`}>
                        ₹{(r.allocated - r.utilized).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <div className="truncate" title={r.project || "-"}>
                          {r.project || <span className="text-slate-400">-</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1.5 rounded-lg border border-red-400/50 transition-all duration-200 hover:scale-105 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => deleteRecord(r.id)}
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-white/70">
                        <svg className="w-16 h-16 mx-auto text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xl font-medium">No records found</p>
                        <p className="mt-2">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}