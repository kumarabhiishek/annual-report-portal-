import { useState, useEffect } from "react";
import photo1 from "../assets/photo5.jpeg";
import photo2 from "../assets/photo2.jpeg";
import photo3 from "../assets/photo3.jpeg";
import photo4 from "../assets/photo4.jpeg";
const Dashboard = ({ isAdminLoggedIn, setIsAdminLoggedIn, currentView, setCurrentView }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [photo1, photo2, photo3, photo4];
  const openModal = (modalId) => {
    setActiveModal(modalId);
  };
  const closeModal = () => setActiveModal(null);
  const goBackToDashboard = () => setCurrentView("dashboard");
  const handleLogin = (type) => {
    if (type === "admin") {
      setIsAdminLoggedIn(true);
    }
    setCurrentView("home");
  };
  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Auto slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);
  // Render Dashboard view
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed and always visible */}
<header className="fixed top-0 w-full z-50 bg-blue-900 shadow-lg">
  <div className="w-full px-4 sm:px-6 py-3 sm:py-4 relative">
    {/* Absolutely centered title */}
    <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-white">
      Annual Report Portal
    </h1>
    {/* Optional left content (logo/menu icon) */}
    <div className="flex items-center gap-3">
      {/* Example: <img src="/logo.svg" alt="Logo" className="h-8" /> */}
    </div>
    {/* Navbar */}
    <nav className="p-3 rounded-lg mt-2 bg-blue-800 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
          {["Home", "About", "Contact", "Help"].map((item, index) => (
            <button
              key={index}
              onClick={() =>
                item === "Home"
                  ? setCurrentView("home")
                  : openModal(item.toLowerCase())
              }
              className="relative text-white hover:text-blue-200 font-medium transition-all duration-300 group px-3 py-2 rounded-lg hover:bg-white/10"
            >
              {item}
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </div>
        {/* Admin Login */}
        <div className="mr-6">
          <button
            onClick={() => setCurrentView("login")}
            className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Admin Login
          </button>
        </div>
      </div>
    </nav>
  </div>
</header>
      {/* Add padding to account for fixed header */}
      <div className="pt-25">
        {/* Hero Slider with Overlay - Full Screen */}
        <div className="relative w-full h-screen overflow-hidden mb-12">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/70"></div>
            </div>
          ))}
          
          {/* Hero Content */}
         <div className="absolute inset-0 flex items-center justify-center text-center px-4">
  <div className="text-white w-full max-w-6xl mx-auto">
    <div className="overflow-x-hidden">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 break-words">
        Welcome to Annual Report Portal
      </h2>
    </div>
    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 font-light">
      Excellence of Technical Education 
    </p>
  </div>
</div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "17+", label: "Years of Excellence" },
              { number: "40+", label: "Acre Campus" },
              { number: "250+", label: "Labs & Facilities" },
              { number: "NAAC", label: "Accredited" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Explore Our Portal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Access comprehensive information across all departments and facilities
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { icon: "📊", title: "Dashboard", link: "/", color: "from-blue-500 to-blue-600" },
                { icon: "🔬", title: "Research", link: "/research", color: "from-green-500 to-green-600" },
                { icon: "💰", title: "Finance", link: "/finance", color: "from-yellow-500 to-yellow-600" },
                { icon: "🏢", title: "Infrastructure", link: "/infrastructure", color: "from-purple-500 to-purple-600" },
                { icon: "🎓", title: "Academics", link: "/academics", color: "from-red-500 to-red-600" },
                { icon: "🤝", title: "Collaboration", link: "/collaboration", color: "from-indigo-500 to-indigo-600" },
                { icon: "📝", title: "Final Report", link: "/report", color: "from-pink-500 to-pink-600" },
                { icon: "💼", title: "Placement", link: "/placement", color: "from-teal-500 to-teal-600" },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">Access detailed reports and analytics</p>
                  <a
                    href={card.link}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Explore
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News & Updates Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Latest News & Updates
              </h2>
              <p className="text-xl text-gray-600">Stay updated with the latest happenings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "New Research Grant", date: "Dec 15, 2024", desc: "₹2.5Cr grant for AI research project" },
                { title: "Placement Drive", date: "Dec 20, 2024", desc: "50+ companies participating" },
                { title: "Infrastructure Upgrade", date: "Jan 5, 2025", desc: "New smart classrooms added" }
              ].map((news, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold w-fit mb-4">
                    {news.date}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.desc}</p>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1">
                    Read More <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What Our Students Say
              </h2>
              <p className="text-xl text-gray-600">Hear from our vibrant student community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Rahul Sharma", role: "B.Tech CSE", text: "SISTec provided me with excellent opportunities to grow both academically and personally. The faculty is very supportive." },
                { name: "Priya Singh", role: "M.Tech AI", text: "The campus infrastructure and labs are world-class. I got hands-on experience with the latest technologies." },
                { name: "Amit Kumar", role: "Placement Cell", text: "The placement cell worked tirelessly to ensure we got the best opportunities. I secured my dream job thanks to them." }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
          
              
              <p className="text-gray-400">Excellence in Technical Education Since 2007</p>
            </div>
            
            {[
              { title: "Quick Links", links: ["Admissions", "Academics", "Research", "Placements"] },
              { title: "Resources", links: ["Library", "Labs", "Hostels", "Sports"] },
              { title: "Support", links: ["Help Center", "Contact Us", "Feedback", "Emergency"] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Full Screen Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={closeModal}></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <button
                className="absolute top-4 right-4 z-10 text-gray-500 hover:text-red-500 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all hover:scale-110"
                onClick={closeModal}
              >
                &times;
              </button>

              {/* About Modal */}
              {activeModal === "about" && (
                <div className="h-full overflow-y-auto">
                  <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                    
                      <p className="text-xl">Excellence in Education Since 2007</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                        <p className="text-gray-600 mb-4">
                          To be a center of excellence in technical education, fostering innovation, research, and 
                          entrepreneurship to create globally competent professionals who contribute to societal development.
                        </p>
                        <p className="text-gray-600">
                          We strive to create an environment that nurtures creativity, critical thinking, and 
                          ethical values among our students.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                        <ul className="text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Provide quality education through innovative teaching methodologies
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Foster research and development activities
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Establish strong industry-academia collaboration
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Develop globally competent professionals with ethical values
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Achievements</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { number: "17+", label: "Years of Excellence" },
                          { number: "10,000+", label: "Alumni" },
                          { number: "200+", label: "Faculty Members" },
                          { number: "50+", label: "Acres Campus" }
                        ].map((item, index) => (
                          <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{item.number}</div>
                            <div className="text-sm text-gray-600">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Leadership</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "Dr. Rajesh Kumar", role: "Director", desc: "Ph.D in Computer Science with 25+ years of experience" },
                          { name: "Prof. Sunita Sharma", role: "Dean Academics", desc: "Expert in curriculum development and quality assurance" },
                          { name: "Dr. Amit Verma", role: "Head of R&D", desc: "Leading research initiatives and industry collaborations" }
                        ].map((leader, index) => (
                          <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
                              {leader.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h4 className="font-semibold text-gray-800">{leader.name}</h4>
                            <p className="text-blue-600 mb-2">{leader.role}</p>
                            <p className="text-sm text-gray-600">{leader.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Modal */}
              {activeModal === "contact" && (
                <div className="h-full overflow-y-auto">
                  <div className="relative h-64 bg-gradient-to-r from-green-600 to-teal-700">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-4xl font-bold mb-2">Contact Us</h2>
                      <p className="text-xl">We'd love to hear from you</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Get In Touch</h3>
                        <form className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your Name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your.email@example.com" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your message..."></textarea>
                          </div>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            Send Message
                          </button>
                        </form>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                              <span className="text-blue-600 text-xl">📍</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Address</h4>
                          
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-3 rounded-lg mr-4">
                              <span className="text-green-600 text-xl">📞</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Phone</h4>
                              <p className="text-gray-600">+91 755 267 0551<br />+91 755 267 0552</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-red-100 p-3 rounded-lg mr-4">
                              <span className="text-red-600 text-xl">📧</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Email</h4>
                              <p className="text-gray-600">info@ac.in<br />admission@.ac.in</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-purple-100 p-3 rounded-lg mr-4">
                              <span className="text-purple-600 text-xl">🕒</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Office Hours</h4>
                              <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM<br />Saturday: 9:00 AM - 1:00 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Campus Location</h3>
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl">🗺️</span>
                          <p className="text-gray-600 mt-2">Interactive Campus Map</p>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 text-sm">
                            View Larger Map
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Modal */}
              {activeModal === "help" && (
                <div className="h-full overflow-y-auto">
                  <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-700">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-4xl font-bold mb-2">Help & Support</h2>
                      <p className="text-xl">We're here to help you</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                          {[
                            { question: "How do I access my academic reports?", answer: "Login to your student portal and navigate to the Reports section." },
                            { question: "What should I do if I forget my password?", answer: "Use the 'Forgot Password' link on the login page to reset your password." },
                            { question: "How can I contact my department?", answer: "Visit the Department section in the portal or email directly to your HOD." },
                            { question: "Where can I find placement information?", answer: "All placement details are available in the Placement section of the portal." }
                          ].map((faq, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                              <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Support</h3>
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-6 rounded-xl">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                              <span className="text-xl mr-2">💬</span> Live Chat Support
                            </h4>
                            <p className="text-blue-600 text-sm mb-3">Get instant help from our support team</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                              Start Chat
                            </button>
                          </div>
                          
                          <div className="bg-green-50 p-6 rounded-xl">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                              <span className="text-xl mr-2">📋</span> Knowledge Base
                            </h4>
                            <p className="text-green-600 text-sm mb-3">Browse our comprehensive guides and tutorials</p>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                              Explore Guides
                            </button>
                          </div>
                          
                          <div className="bg-purple-50 p-6 rounded-xl">
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                              <span className="text-xl mr-2">📞</span> Emergency Support
                            </h4>
                            <p className="text-purple-600 text-sm mb-3">Immediate assistance for urgent issues</p>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Support Departments</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { name: "IT Support", icon: "💻", contact: "it-support@sistec.ac.in" },
                          { name: "Admissions", icon: "🎓", contact: "admissions@sistec.ac.in" },
                          { name: "Examination", icon: "📝", contact: "exam@sistec.ac.in" },
                          { name: "Placement", icon: "💼", contact: "placement@sistec.ac.in" }
                        ].map((dept, index) => (
                          <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="text-2xl mb-2">{dept.icon}</div>
                            <h4 className="font-semibold text-gray-800 mb-2">{dept.name}</h4>
                            <p className="text-sm text-gray-600">{dept.contact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;