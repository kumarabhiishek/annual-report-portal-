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
            {["overview"].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                onClick={() => setActiveTab(tab)}
                disabled={loading}
              >
                {tab === "overview" && "Overview"}
               
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
      </div>
    </div>
  );
}