import React, { useState, useMemo } from 'react';
import { 
  FiBook, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiTrendingUp,
  FiPlus,
  FiX,
  FiFileText,
  FiBookOpen,
  FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Publications = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([
    {
      id: 1,
      title: "AI-Driven Predictive Maintenance in Manufacturing Systems",
      authors: ["Dr. Rajesh Kumar", "Prof. Sunita Sharma", "Dr. Michael Chen"],
      journal: "International Journal of Advanced Manufacturing Technology",
      year: 2024,
      volume: "45",
      issue: "3",
      pages: "234-245",
      doi: "10.1007/s00170-024-13545-6",
      impactFactor: 3.8,
      category: "Engineering",
      citations: 42,
      status: "Published",
      publicationType: "Journal Article",
      fundingAgency: "Department of Science & Technology",
      fileUrl: "/publications/ai-predictive-maintenance.pdf",
      abstract: "This research explores the implementation of artificial intelligence for predictive maintenance in industrial manufacturing systems, significantly reducing downtime and maintenance costs."
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions for Rural Development",
      authors: ["Dr. Priya Singh", "Dr. Robert Wilson"],
      journal: "Renewable and Sustainable Energy Reviews",
      year: 2024,
      volume: "189",
      issue: "2",
      pages: "113-125",
      doi: "10.1016/j.rser.2023.113456",
      impactFactor: 15.9,
      category: "Energy",
      citations: 28,
      status: "Published",
      publicationType: "Journal Article",
      fundingAgency: "Ministry of New and Renewable Energy",
      fileUrl: "/publications/sustainable-energy-rural.pdf",
      abstract: "Comprehensive analysis of renewable energy technologies and their implementation strategies for rural communities in developing countries."
    },
    {
      id: 3,
      title: "Blockchain Applications in Supply Chain Management",
      authors: ["Dr. Amit Patel", "Dr. Lisa Zhang", "Prof. David Brown"],
      conference: "IEEE International Conference on Blockchain",
      year: 2023,
      pages: "156-162",
      doi: "10.1109/BLOCKCHAIN.2023.1234567",
      category: "Computer Science",
      citations: 35,
      status: "Published",
      publicationType: "Conference Paper",
      fundingAgency: "Industry Collaboration",
      fileUrl: "/publications/blockchain-supply-chain.pdf",
      abstract: "Investigating the transformative potential of blockchain technology in enhancing transparency and efficiency in global supply chains."
    },
    {
      id: 4,
      title: "Advanced Nanomaterials for Water Purification",
      authors: ["Dr. Sanjay Verma", "Dr. Emily Johnson"],
      journal: "Journal of Materials Chemistry A",
      year: 2023,
      volume: "11",
      issue: "15",
      pages: "789-801",
      doi: "10.1039/D2TA09876C",
      impactFactor: 12.7,
      category: "Materials Science",
      citations: 67,
      status: "Published",
      publicationType: "Journal Article",
      fundingAgency: "Council of Scientific & Industrial Research",
      fileUrl: "/publications/nanomaterials-water-purification.pdf",
      abstract: "Development of novel nanomaterials with enhanced properties for efficient and cost-effective water purification systems."
    },
    {
      id: 5,
      title: "Machine Learning in Healthcare Diagnostics",
      authors: ["Dr. Anjali Mehta", "Dr. James Anderson", "Dr. Wei Li"],
      journal: "Nature Medicine",
      year: 2024,
      volume: "30",
      issue: "1",
      pages: "45-58",
      doi: "10.1038/s41591-023-02745-2",
      impactFactor: 87.2,
      category: "Healthcare",
      citations: 89,
      status: "Published",
      publicationType: "Journal Article",
      fundingAgency: "Indian Council of Medical Research",
      fileUrl: "/publications/ml-healthcare-diagnostics.pdf",
      abstract: "Revolutionary machine learning algorithms for early detection and diagnosis of various medical conditions with unprecedented accuracy."
    }
  ]);

  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    publicationType: 'all',
    searchQuery: ''
  });

  const [selectedPublication, setSelectedPublication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalPublications = publications.length;
    const totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0);
    const averageImpact = publications.filter(pub => pub.impactFactor)
      .reduce((sum, pub) => sum + pub.impactFactor, 0) / 
      publications.filter(pub => pub.impactFactor).length;
    
    const currentYear = new Date().getFullYear();
    const currentYearPublications = publications.filter(pub => pub.year === currentYear).length;

    return {
      totalPublications,
      totalCitations,
      averageImpact: averageImpact.toFixed(1),
      currentYearPublications
    };
  }, [publications]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter(publication => {
      const matchesYear = filters.year === 'all' || publication.year.toString() === filters.year;
      const matchesCategory = filters.category === 'all' || publication.category === filters.category;
      const matchesType = filters.publicationType === 'all' || publication.publicationType === filters.publicationType;
      const matchesSearch = publication.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           publication.authors.some(author => 
                             author.toLowerCase().includes(filters.searchQuery.toLowerCase())
                           ) ||
                           (publication.journal && publication.journal.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return matchesYear && matchesCategory && matchesType && matchesSearch;
    });
  }, [publications, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openPublicationDetails = (publication) => {
    setSelectedPublication(publication);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPublication(null);
  };

  const exportPublications = () => {
    // In a real application, this would generate and download a CSV/PDF
    alert('Export feature would download publications data');
  };

  const handleBackToAdmin = () => {
    navigate('/admin-home1'); // Adjust the path according to your admin route
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'dark bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <FiBookOpen className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Research Publications
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Sagar Institute of Science & Technology - Annual Research Output
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToAdmin}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
              <FiArrowLeft className="text-lg" />
              <span>Back to Admin</span>
            </button>
            
            <button
              onClick={exportPublications}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
              <FiDownload className="text-lg" />
              <span>Export Data</span>
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? <FiEye className="text-xl" /> : <FiEye className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Publications</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalPublications}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FiBook className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
              <FiTrendingUp className="mr-1" />
              <span>{stats.currentYearPublications} this year</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Citations</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalCitations}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <FiBarChart2 className="text-2xl text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Research impact
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Avg. Impact Factor</p>
                <h3 className="text-3xl font-bold mt-2">{stats.averageImpact}</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <FiTrendingUp className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Journal quality metric
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">H-Index</p>
                <h3 className="text-3xl font-bold mt-2">24</h3>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <FiUser className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Institutional ranking
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Publications
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or journal..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Energy">Energy</option>
                  <option value="Materials Science">Materials Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.publicationType}
                  onChange={(e) => handleFilterChange('publicationType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="Journal Article">Journal Article</option>
                  <option value="Conference Paper">Conference Paper</option>
                  <option value="Book Chapter">Book Chapter</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Research Publications</h2>
              <span className="text-gray-500 dark:text-gray-400">
                {filteredPublications.length} publications found
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Publication Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Citations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPublications.map((publication) => (
                  <tr 
                    key={publication.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => openPublicationDetails(publication)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {publication.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {publication.authors.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {publication.journal || publication.conference}
                          {publication.volume && `, Vol. ${publication.volume}`}
                          {publication.issue && `(${publication.issue})`}
                          {publication.pages && `, pp. ${publication.pages}`}
                        </p>
                        {publication.impactFactor && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mt-2">
                            Impact Factor: {publication.impactFactor}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        <FiCalendar className="mr-1" />
                        {publication.year}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {publication.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiBarChart2 className="text-gray-400 mr-2" />
                        <span className="font-semibold">{publication.citations}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPublicationDetails(publication);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="text-lg" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download logic here
                          }}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Download PDF"
                        >
                          <FiDownload className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPublications.length === 0 && (
              <div className="text-center py-12">
                <FiBook className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No publications found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publication Detail Modal */}
      {showModal && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Publication Details
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedPublication.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedPublication.authors.join(', ')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Publication Venue
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPublication.journal || selectedPublication.conference}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedPublication.year}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedPublication.category}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Publication Type
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedPublication.publicationType}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Citations
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedPublication.citations}</p>
                  </div>

                  {selectedPublication.impactFactor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Impact Factor
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedPublication.impactFactor}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Abstract
                </label>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedPublication.abstract}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  DOI
                </label>
                <a 
                  href={`https://doi.org/${selectedPublication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {selectedPublication.doi}
                </a>
              </div>

              {selectedPublication.fundingAgency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Funding Agency
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">{selectedPublication.fundingAgency}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {/* Download logic */}}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <FiDownload className="text-lg" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;