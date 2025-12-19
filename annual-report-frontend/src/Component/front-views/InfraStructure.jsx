import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

const AnnualReportPortal = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedDept, setSelectedDept] = useState('all');

  // Sample data - replace with actual API data
  const financialData = [
    { month: 'Jan', revenue: 4500000, expenses: 3200000, profit: 1300000 },
    { month: 'Feb', revenue: 5200000, expenses: 3800000, profit: 1400000 },
    { month: 'Mar', revenue: 4800000, expenses: 3500000, profit: 1300000 },
    { month: 'Apr', revenue: 6100000, expenses: 4200000, profit: 1900000 },
    { month: 'May', revenue: 5500000, expenses: 3900000, profit: 1600000 },
    { month: 'Jun', revenue: 5900000, expenses: 4100000, profit: 1800000 },
    { month: 'Jul', revenue: 6300000, expenses: 4400000, profit: 1900000 },
    { month: 'Aug', revenue: 5800000, expenses: 4000000, profit: 1800000 },
    { month: 'Sep', revenue: 6700000, expenses: 4600000, profit: 2100000 },
    { month: 'Oct', revenue: 7200000, expenses: 4800000, profit: 2400000 },
    { month: 'Nov', revenue: 6900000, expenses: 4700000, profit: 2200000 },
    { month: 'Dec', revenue: 8100000, expenses: 5200000, profit: 2900000 },
  ];

  const departmentPerformance = [
    { name: 'Engineering', revenue: 28500000, growth: 24, budget: 15000000 },
    { name: 'Sales', revenue: 19200000, growth: 18, budget: 8000000 },
    { name: 'Marketing', revenue: 15600000, growth: 32, budget: 5000000 },
    { name: 'Research', revenue: 9800000, growth: 15, budget: 7000000 },
    { name: 'Operations', revenue: 12300000, growth: 12, budget: 9000000 },
  ];

  const kpiData = [
    { name: 'Revenue Growth', value: 28, target: 25, status: 'exceeded' },
    { name: 'Profit Margin', value: 32, target: 30, status: 'exceeded' },
    { name: 'Customer Satisfaction', value: 94, target: 90, status: 'exceeded' },
    { name: 'Employee Engagement', value: 87, target: 85, status: 'met' },
    { name: 'Operational Efficiency', value: 78, target: 80, status: 'below' },
  ];

  const projectStatus = [
    { name: 'Completed', value: 42, color: '#10b981' },
    { name: 'In Progress', value: 35, color: '#f59e0b' },
    { name: 'Delayed', value: 15, color: '#ef4444' },
    { name: 'Planning', value: 8, color: '#6366f1' },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Annual Report Portal</h1>
                <p className="text-sm text-gray-500">Comprehensive Business Insights & Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'financial', label: 'Financial', icon: '💰' },
              { id: 'performance', label: 'Performance', icon: '📈' },
              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'hr', label: 'HR Analytics', icon: '👥' },
              { id: 'customers', label: 'Customers', icon: '🤝' },
              { id: 'comparison', label: 'Comparison', icon: '⚖️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹68.2M</p>
                    <p className="text-sm text-green-600 mt-1">+28% from last year</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹21.8M</p>
                    <p className="text-sm text-green-600 mt-1">+32% from last year</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">87</p>
                    <p className="text-sm text-green-600 mt-1">42 completed</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Employee Growth</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+124</p>
                    <p className="text-sm text-green-600 mt-1">18% increase</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue vs Expenses */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Profit Trend */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Profit Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.2}
                        name="Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Performance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI Performance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Performance</h3>
                <div className="space-y-4">
                  {kpiData.map((kpi, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{kpi.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              kpi.status === 'exceeded' ? 'bg-green-500' : 
                              kpi.status === 'met' ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(kpi.value, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Target: {kpi.target}%</span>
                          <span className={`text-xs font-medium ${
                            kpi.status === 'exceeded' ? 'text-green-600' : 
                            kpi.status === 'met' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {kpi.status === 'exceeded' ? 'Exceeded' : 
                             kpi.status === 'met' ? 'Met Target' : 'Below Target'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {projectStatus.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="font-medium text-gray-700">{project.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{project.value} projects</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Section */}
        {activeSection === 'financial' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        name="Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        name="Expenses"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        name="Profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Gross Margin</span>
                      <span className="font-semibold text-green-600">42%</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Operating Expenses</span>
                      <span className="font-semibold text-gray-900">₹48.2M</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Net Profit Margin</span>
                      <span className="font-semibold text-green-600">32%</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">ROI</span>
                      <span className="font-semibold text-green-600">28%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Budget vs Actual</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="text-sm font-semibold text-green-600">+12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '112%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Expenses</span>
                        <span className="text-sm font-semibold text-red-600">-5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Section */}
        {activeSection === 'performance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Revenue Contribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {departmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="growth" fill="#f59e0b" name="Growth %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State for other sections */}
        {!['dashboard', 'financial', 'performance'].includes(activeSection) && (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Section Under Development</h3>
              <p className="text-gray-600 mb-6">
                The {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section is currently being developed and will be available soon.
              </p>
              <button 
                onClick={() => setActiveSection('dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600">
              <p>© 2024 Annual Report Portal. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Terms of Service
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnnualReportPortal;