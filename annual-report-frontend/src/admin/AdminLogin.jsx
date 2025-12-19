
// import { useState } from "react";
// import SISTecLogo from "../assets/SISTec_Logo.jpeg";

// const AdminLogin = ({ onLogin, onBack }) => {
//   const [loginType, setLoginType] = useState("admin"); // student, faculty, admin
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     rememberMe: false
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you would typically validate credentials
//     // For now, we'll just call the onLogin function
//     onLogin(loginType);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       </div>

//       <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
//         <div className="w-full px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <img
//                 src={SISTecLogo}
//                 alt="SISTec Logo"
//                 className="h-16 w-16 rounded-xl shadow-lg"
//               />
//               <div>
//                 <h1 className="text-2xl md:text-4xl font-bold text-white">
//                   Annual Report Portal
//                 </h1>
//                 <p className="text-sm mt-1 text-blue-200">
//                   Sagar Institute of Science & Technology
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onBack}
//               className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="pt-32 pb-20 px-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
//                 Login Portal
//               </h2>
//               <p className="text-blue-100">Access your account with secure login</p>
//             </div>

//             {/* Login Type Selector */}
//             <div className="flex justify-center mb-8">
//               <div className="bg-white/10 rounded-xl p-1 flex">
//                 {["student", "faculty", "admin"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setLoginType(type)}
//                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                       loginType === type
//                         ? "bg-white text-blue-700 shadow-lg"
//                         : "text-white hover:bg-white/10"
//                     }`}
//                   >
//                     {type.charAt(0).toUpperCase() + type.slice(1)} Login
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-white mb-2 font-medium">
//                   {loginType === "admin" ? "Admin ID" : 
//                     loginType === "faculty" ? "Faculty ID" : "Student ID"}
//                 </label>
//                 <input 
//                   type="text" 
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                   placeholder={`Enter your ${loginType} ID`}
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-white mb-2 font-medium">Password</label>
//                 <input 
//                   type="password" 
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center text-white">
//                   <input 
//                     type="checkbox" 
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className="rounded border-white/30 text-blue-600 focus:ring-blue-500" 
//                   />
//                   <span className="ml-2">Remember me</span>
//                 </label>
//                 <a href="#" className="text-blue-300 hover:text-blue-200 text-sm">
//                   Forgot Password?
//                 </a>
//               </div>
              
//               <button 
//                 type="submit"
//                 className="w-full bg-white text-blue-700 hover:bg-blue-50 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               >
//                 Sign In
//               </button>
//             </form>

//             {/* Additional Links */}
//             <div className="text-center mt-6">
//               <p className="text-blue-200">
//                 Don't have an account?{" "}
//                 <a href="#" className="text-white hover:underline font-semibold">
//                   Contact Administration
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;




import { useState } from "react";
import SISTecLogo from "../assets/SISTec_Logo.jpeg";
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin, onBack }) => {
  const [loginType, setLoginType] = useState("admin"); // student, faculty, admin
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    department: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData(prev => ({
      ...prev,
      department: "" // Reset department when login type changes
    }));
    setError(""); // Clear errors when switching login types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let apiUrl;

      // Construct API URL based on login type
      if (loginType === 'faculty') {
        apiUrl = `http://localhost:7070/api/faculty/login?username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.password)}&role=${encodeURIComponent(loginType)}&department=${encodeURIComponent(formData.department)}`;
      } else {
        apiUrl = `http://localhost:7070/api/login?username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.password)}&role=${encodeURIComponent(loginType === 'student' ? 'studentlogin' : loginType)}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
      });

      if (response.ok) {
        // Call the parent onLogin callback if provided
        if (onLogin) {
          onLogin(loginType);
        }
        
        // Handle navigation based on login type and department
        if (loginType === 'admin') {
          navigate('/admin-home1');
        } else if (loginType === 'faculty') {
          // Navigate to department-specific routes
          switch (formData.department) {
            case 'Computer Science':
              navigate('/computer-science');
              break;
            case 'Mechanical Engineering':
              navigate('/mechanical');
              break;
            case 'Electrical Engineering':
              navigate('/electrical-engineering');
              break;
            case 'Civil Engineering':
              navigate('/civil-engineering');
              break;
            default:
              navigate('/faculty-home');
          }
        } else if (loginType === 'student') {
          navigate('/student-home');
        }
      } else {
        const errorText = await response.text();
        setError(errorText || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (loginType) {
      case 'admin': return 'Enter admin email';
      case 'faculty': return 'Enter faculty email';
      case 'student': return 'Enter student email';
      default: return 'Enter your email';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <img
                src={SISTecLogo}
                alt="SISTec Logo"
                className="h-16 w-16 rounded-xl shadow-lg"
              /> */}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  Annual Report Portal
                </h1>
                
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Login Portal
              </h2>
              <p className="text-blue-100">Access your account with secure login</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-xl text-red-200 text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Login Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-xl p-1 flex">
                {["student", "faculty", "admin"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleLoginTypeChange(type)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      loginType === type
                        ? "bg-white text-blue-700 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                    disabled={loading}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Login
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2 font-medium">
                  {loginType === "admin" ? "Admin ID" : 
                    loginType === "faculty" ? "Faculty ID" : "Student ID"}
                </label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={getPlaceholderText()}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-white mb-2 font-medium">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Department Selection for Faculty */}
              {loginType === 'faculty' && (
                <div>
                  <label className="block text-white mb-2 font-medium">Department</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept} className="text-gray-800">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-white">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="rounded border-white/30 text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
                    disabled={loading}
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-blue-300 hover:text-blue-200 text-sm">
                  Forgot Password?
                </a>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="text-center mt-6">
              <p className="text-blue-200">
                Don't have an account?{" "}
                <a href="#" className="text-white hover:underline font-semibold">
                  Contact Administration
                </a>
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-200 text-sm text-center">
                <strong>Demo Access:</strong> Use your institutional credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;