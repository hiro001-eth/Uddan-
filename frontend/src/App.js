import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partners, setPartners] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  
  // Search states
  const [searchParams, setSearchParams] = useState({
    country: '',
    state: '',
    jobType: '',
    searchQuery: ''
  });
  
  // Application form states
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    available_countries: [],
    cover_letter: ''
  });

  useEffect(() => {
    initializeData();
    fetchData();
  }, []);

  const initializeData = async () => {
    try {
      await axios.post(`${API}/init-data`);
    } catch (error) {
      console.log('Data already initialized or error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [oppResponse, testimonialResponse, partnerResponse, countryResponse] = await Promise.all([
        axios.get(`${API}/opportunities`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/partners`),
        axios.get(`${API}/countries`)
      ]);
      
      setOpportunities(oppResponse.data);
      setTestimonials(testimonialResponse.data);
      setPartners(partnerResponse.data);
      setCountries(countryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.country) params.append('country', searchParams.country);
      if (searchParams.jobType) params.append('job_type', searchParams.jobType);
      if (searchParams.searchQuery) params.append('search_query', searchParams.searchQuery);
      
      const response = await axios.get(`${API}/opportunities?${params.toString()}`);
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error searching opportunities:', error);
    }
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setApplicationData({
      ...applicationData,
      opportunity_id: opportunity.id
    });
    setShowApplicationForm(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/applications`, {
        ...applicationData,
        opportunity_id: selectedOpportunity.id
      });
      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({
        applicant_name: '',
        email: '',
        phone: '',
        available_countries: [],
        cover_letter: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-2xl text-blue-600 font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                🚀 Uddaan Consultancy
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</button>
                <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">About</button>
                <button onClick={() => scrollToSection('destinations')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Top Destinations</button>
                <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Services</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Testimonials</button>
                <button onClick={() => scrollToSection('blog')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Blog</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Contact</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85')`
          }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect Course in Your <span className="text-blue-300">Dream Destination</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Bridging education and ambition. Your gateway to international opportunities for study and work.
          </p>
          
          {/* Search Box */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <select
                value={searchParams.country}
                onChange={(e) => setSearchParams({...searchParams, country: e.target.value})}
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.name}>{country.name}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="State/Province"
                value={searchParams.state}
                onChange={(e) => setSearchParams({...searchParams, state: e.target.value})}
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              <select
                value={searchParams.jobType}
                onChange={(e) => setSearchParams({...searchParams, jobType: e.target.value})}
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Study or Work</option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="both">Both</option>
              </select>
              
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchParams.searchQuery}
                onChange={(e) => setSearchParams({...searchParams, searchQuery: e.target.value})}
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              🔍 Search Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {opportunities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Available Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.map(opportunity => (
                <div key={opportunity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        opportunity.job_type === 'study' ? 'bg-blue-100 text-blue-800' :
                        opportunity.job_type === 'work' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {opportunity.job_type === 'study' ? '🎓 Study' : opportunity.job_type === 'work' ? '💼 Work' : '🎯 Both'}
                      </span>
                      <span className="text-sm text-gray-500">{opportunity.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
                    {opportunity.salary_range && (
                      <p className="text-sm text-blue-600 font-medium mb-2">💰 {opportunity.salary_range}</p>
                    )}
                    {opportunity.duration && (
                      <p className="text-sm text-gray-500 mb-4">⏱️ {opportunity.duration}</p>
                    )}
                    <button
                      onClick={() => handleApply(opportunity)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Study Destinations */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Study Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              It's not about going to a new place, but learning new ways.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Study in Australia', image: 'https://images.unsplash.com/photo-1600633349333-eebb43d01e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇦🇺' },
              { name: 'Study in United Kingdom', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇬🇧' },
              { name: 'Study in Canada', image: 'https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇨🇦' },
              { name: 'Study in United States', image: 'https://images.unsplash.com/photo-1573119574031-80390c957549?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇺🇸' },
              { name: 'Study in New Zealand', image: 'https://images.unsplash.com/photo-1600633349333-eebb43d01e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇳🇿' },
              { name: 'Study in Germany', image: 'https://images.pexels.com/photos/159746/notebook-pen-pencil-education-159746.jpeg', flag: '🇩🇪' },
              { name: 'Study in France', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇫🇷' },
              { name: 'Study in Netherlands', image: 'https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇳🇱' }
            ].map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 text-4xl">{destination.flag}</div>
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                  {destination.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Other Support Services We Provide</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Studying abroad offers a wealth of benefits, from expanding your academic horizons to enhancing your career prospects. 
              With Uddaan Consultancy, you'll receive expert guidance to make your study abroad journey seamless and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Career Counseling', icon: '🎯', desc: 'Personalized career counseling to help you make informed decisions about your educational and professional pathways.' },
              { title: 'Course & University Selection', icon: '🏫', desc: 'Expert guidance in choosing the most suitable courses and universities for your career goals.' },
              { title: 'Test Preparations', icon: '📚', desc: 'Comprehensive preparation for IELTS, TOEFL, GRE, GMAT and other standardized tests.' },
              { title: 'Visa Guidance', icon: '📄', desc: 'Complete visa application support with high success rates and expert documentation assistance.' },
              { title: 'Loan & Financial Guidance', icon: '💳', desc: 'Comprehensive support for education loans and financial planning for your studies abroad.' },
              { title: 'Pre-departure Briefing', icon: '✈️', desc: 'Essential preparation sessions to ensure you are ready for your journey abroad.' },
              { title: 'Accommodation Support', icon: '🏠', desc: 'Help finding suitable accommodation options in your destination country.' },
              { title: 'Immigration Services', icon: '🌍', desc: 'Expert immigration advice and support for permanent residency applications.' },
              { title: 'Spouse & Family Visa', icon: '👨‍👩‍👧‍👦', desc: 'Guidance for family reunification and dependent visa applications.' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Partners */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Universities We Partner With</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map(partner => (
              <div key={partner.id} className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Got Questions?</h2>
          <p className="text-xl text-center text-gray-600 mb-16">We got the answers</p>
          
          <div className="space-y-6">
            {[
              {
                question: "What countries do you help students apply to?",
                answer: "Uddaan Consultancy assists students in applying to universities in Australia, UK, Canada, USA, New Zealand, Germany, France, Netherlands and many more countries."
              },
              {
                question: "How long does the application process typically take?",
                answer: "The application process typically takes 3-6 months depending on the country, university, and course. We provide detailed timelines for each application."
              },
              {
                question: "Can you help with scholarship applications?",
                answer: "Yes, we provide comprehensive scholarship guidance and help identify suitable scholarship opportunities based on your profile and chosen destination."
              },
              {
                question: "What is the processing time for visas?",
                answer: "Visa processing times vary by country: Australia (4-6 weeks), Canada (8-12 weeks), UK (3-6 weeks), USA (2-4 months). We provide regular updates throughout the process."
              },
              {
                question: "Is it mandatory to take an English language test?",
                answer: "Most universities require English proficiency tests like IELTS or TOEFL. However, some universities offer waivers based on previous education in English. We'll guide you based on your specific situation."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Uddaan Consultancy</h2>
              <p className="text-lg text-gray-600 mb-6">
                Uddaan Consultancy is a team of education professionals dedicated to helping students achieve their dreams of studying and working abroad. 
                With years of experience and a passion for education, we are committed to providing top-notch service to our clients.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We understand that pursuing education or career opportunities abroad can be overwhelming. That's why we're here to guide you through 
                every step of the process, from initial consultation to your successful settlement in your chosen destination.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Successful Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-600">University Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">95%</div>
                  <div className="text-gray-600">Visa Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573119574031-80390c957549?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85"
                alt="About us"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-300">123 Consultancy Street, Education City, EC 12345</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">✉️</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-300">info@uddaanconsultancy.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🕒</span>
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">🚀 Uddaan Consultancy</div>
              <p className="text-gray-300 mb-4">Bridging education and ambition.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">📘 Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">📷 Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">📺 YouTube</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partnership & Collaboration</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Study Abroad</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Study in Australia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study in UK</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study in Canada</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study in USA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Other</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ongoing Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© Copyright Uddaan Consultancy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Application Form Modal */}
      {showApplicationForm && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Apply for {selectedOpportunity.title}</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={submitApplication} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicationData.applicant_name}
                  onChange={(e) => setApplicationData({...applicationData, applicant_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicationData.email}
                  onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Countries *</label>
                <select
                  multiple
                  required
                  value={applicationData.available_countries}
                  onChange={(e) => setApplicationData({
                    ...applicationData, 
                    available_countries: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                >
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple countries</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                <textarea
                  value={applicationData.cover_letter}
                  onChange={(e) => setApplicationData({...applicationData, cover_letter: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Tell us why you're interested in this opportunity..."
                ></textarea>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;