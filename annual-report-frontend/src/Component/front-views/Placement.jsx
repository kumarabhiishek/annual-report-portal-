import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Placement = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const stats = [
    { 
      number: '95%', 
      label: 'Placement Rate', 
      icon: '🎯',
      description: 'Students placed in top companies',
      gradient: 'from-green-400 to-blue-500'
    },
    { 
      number: '250+', 
      label: 'Companies Visited', 
      icon: '🏢',
      description: 'Recruiters from various sectors',
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      number: '₹12L', 
      label: 'Highest Package', 
      icon: '💰',
      description: 'Highest annual package offered',
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      number: '₹7.5L', 
      label: 'Average Package', 
      icon: '📊',
      description: 'Average annual package across all students',
      gradient: 'from-blue-400 to-cyan-500'
    }
  ];

  const companies = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '💻' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Infosys', logo: '💼' },
    { name: 'TCS', logo: '🏢' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Meta', logo: '👥' },
    { name: 'Netflix', logo: '🎬' }
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
          🚀 Placement Excellence
        </div>
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Transforming <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Careers</span>
        </h2>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Empowering students to achieve their dreams with top-tier placements and career opportunities
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5
            }}
            className="relative group"
          >
            <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-8 text-white shadow-2xl transform transition-all duration-500 group-hover:shadow-2xl`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
              
              {/* Icon */}
              <div className="relative z-10 text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Number */}
              <div className="relative z-10 text-5xl font-bold mb-2">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="relative z-10 text-xl font-semibold mb-2">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="relative z-10 text-white/80 text-sm">
                {stat.description}
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Highlight Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative mb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 mb-8 lg:mb-0 lg:pr-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold mb-3">
                    {stats[currentStat].label}
                  </h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {stats[currentStat].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="text-8xl font-bold bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {stats[currentStat].number}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {stats.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStat(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentStat 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Recruiters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Trusted by Industry Leaders
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -5, 5, 0]
                }}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {company.logo}
                </div>
                <span className="text-gray-700 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Recruiting Partners →
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-bounce delay-1000"></div>
    </div>
  );
};

export default Placement;