import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partners, setPartners] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    country: '',
    jobType: '',
    searchQuery: ''
  });
  
  const [filters, setFilters] = useState({
    minSalary: '',
    maxSalary: '',
    duration: '',
    sortBy: 'newest'
  });
  
  // Application form states
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    available_countries: []
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
      
      const allOpps = oppResponse.data;
      setAllOpportunities(allOpps);
      
      // Paginate initial results
      const totalPages = Math.ceil(allOpps.length / itemsPerPage);
      setTotalPages(totalPages);
      setOpportunities(allOpps.slice(0, itemsPerPage));
      
      setTestimonials(testimonialResponse.data);
      setPartners(partnerResponse.data);
      setCountries(countryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Pagination function
  const paginateResults = (data, page = 1) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    
    setOpportunities(paginatedData);
    setTotalPages(totalPages);
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.country) params.append('country', searchParams.country);
      if (searchParams.jobType) params.append('job_type', searchParams.jobType);
      if (searchParams.searchQuery) params.append('search_query', searchParams.searchQuery);
      
      const response = await axios.get(`${API}/opportunities?${params.toString()}`);
      const filteredData = applyFilters(response.data);
      paginateResults(filteredData, 1);
      
      // Auto-scroll to results section
      setTimeout(() => {
        const element = document.getElementById('opportunities-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
    } catch (error) {
      console.error('Error searching opportunities:', error);
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];
    
    // Filter by salary range
    if (filters.minSalary || filters.maxSalary) {
      filtered = filtered.filter(opp => {
        if (!opp.salary_range) return true;
        const salaryText = opp.salary_range.toLowerCase();
        const numbers = salaryText.match(/[\d,]+/g);
        if (numbers && numbers.length > 0) {
          const salary = parseInt(numbers[0].replace(/,/g, ''));
          if (filters.minSalary && salary < parseInt(filters.minSalary)) return false;
          if (filters.maxSalary && salary > parseInt(filters.maxSalary)) return false;
        }
        return true;
      });
    }
    
    // Filter by duration
    if (filters.duration) {
      filtered = filtered.filter(opp => 
        opp.duration && opp.duration.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }
    
    // Sort results
    if (filters.sortBy === 'salary_high') {
      filtered.sort((a, b) => {
        const getSalary = (opp) => {
          if (!opp.salary_range) return 0;
          const numbers = opp.salary_range.match(/[\d,]+/g);
          return numbers ? parseInt(numbers[0].replace(/,/g, '')) : 0;
        };
        return getSalary(b) - getSalary(a);
      });
    } else if (filters.sortBy === 'salary_low') {
      filtered.sort((a, b) => {
        const getSalary = (opp) => {
          if (!opp.salary_range) return 0;
          const numbers = opp.salary_range.match(/[\d,]+/g);
          return numbers ? parseInt(numbers[0].replace(/,/g, '')) : 0;
        };
        return getSalary(a) - getSalary(b);
      });
    }
    
    return filtered;
  };

  const handleFilterChange = () => {
    const filteredData = applyFilters(allOpportunities);
    paginateResults(filteredData, 1);
  };

  const handlePageChange = (page) => {
    const filteredData = applyFilters(allOpportunities);
    paginateResults(filteredData, page);
    
    // Scroll to top of opportunities section
    const element = document.getElementById('opportunities-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    // Auto-select the opportunity's country
    setApplicationData({
      applicant_name: '',
      email: '',
      phone: '',
      available_countries: [opportunity.country]
    });
    setShowApplicationForm(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API}/applications`, {
        ...applicationData,
        opportunity_id: selectedOpportunity.id
      });
      
      // Show success message in center for 3 seconds
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowApplicationForm(false);
        setApplicationData({
          applicant_name: '',
          email: '',
          phone: '',
          available_countries: []
        });
        setIsSubmitting(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 8;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg font-semibold transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12 space-x-2">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 rounded-lg font-semibold transition-colors"
          >
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 rounded-lg font-semibold transition-colors"
          >
            Next
          </button>
        )}
        {endPage < totalPages && (
          <span className="px-4 py-2 text-gray-500">
            ...{totalPages}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <div className="text-2xl text-white font-semibold">Loading Your Dream Opportunities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-xl fixed w-full top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Uddaan Consultancy
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Home', 'About', 'Destinations', 'Services', 'Testimonials', 'Blog', 'Contact'].map(item => (
                  <button 
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())} 
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-blue-50 rounded-lg relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85')`
          }}
        ></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            Find Your Perfect 
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
              Dream Destination
            </span>
          </h1>
          <p className="text-2xl md:text-3xl mb-16 text-blue-100 max-w-4xl mx-auto font-light leading-relaxed">
            Transforming Dreams into Reality<br/>
            Your Gateway to Global Opportunities
          </p>
          
          {/* Enhanced Search Box */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 max-w-4xl mx-auto border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <select
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({...searchParams, country: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl text-gray-800 focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg font-semibold bg-white/90 backdrop-blur appearance-none cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <select
                value={searchParams.jobType}
                onChange={(e) => setSearchParams({...searchParams, jobType: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl text-gray-800 focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg font-semibold bg-white/90 backdrop-blur appearance-none cursor-pointer"
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
                className="w-full px-6 py-4 rounded-2xl text-gray-800 focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg font-semibold bg-white/90 backdrop-blur"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-xl shadow-2xl transform hover:scale-105"
            >
              Search Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Search Results with Filters */}
      <section id="opportunities-section" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Available Opportunities</h2>
          
          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                <input
                  type="number"
                  placeholder="Min salary"
                  value={filters.minSalary}
                  onChange={(e) => setFilters({...filters, minSalary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                <input
                  type="number"
                  placeholder="Max salary"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters({...filters, maxSalary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({...filters, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Any Duration</option>
                  <option value="1 year">1 Year</option>
                  <option value="2 year">2 Years</option>
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                  <option value="salary_low">Salary: Low to High</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
          {opportunities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {opportunities.map(opportunity => (
                  <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          opportunity.job_type === 'study' ? 'bg-blue-100 text-blue-800' :
                          opportunity.job_type === 'work' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {opportunity.job_type === 'study' ? 'Study' : opportunity.job_type === 'work' ? 'Work' : 'Both'}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{opportunity.country}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{opportunity.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{opportunity.description}</p>
                      {opportunity.salary_range && (
                        <p className="text-sm text-blue-600 font-bold mb-2">{opportunity.salary_range}</p>
                      )}
                      {opportunity.duration && (
                        <p className="text-sm text-gray-500 mb-4">{opportunity.duration}</p>
                      )}
                      <button
                        onClick={() => handleApply(opportunity)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-500 text-xl">No opportunities found. Try adjusting your filters.</div>
            </div>
          )}
        </div>
      </section>

      {/* Top Study & Work Destinations */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Top Destinations</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              It's not about going to a new place, but learning new ways and creating new opportunities.
            </p>
          </div>
          
          {/* Study Destinations */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-blue-600 mb-12">Study Destinations</h3>
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
                <div key={index} className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden rounded-2xl mb-4 shadow-xl">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">
                        {destination.name.replace('Study in ', '')}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Destinations */}
          <div>
            <h3 className="text-3xl font-bold text-center text-green-600 mb-12">Work Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Work in Dubai, UAE', image: 'https://images.unsplash.com/photo-1600633349333-eebb43d01e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇦🇪' },
                { name: 'Work in Qatar', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇶🇦' },
                { name: 'Work in Saudi Arabia', image: 'https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇸🇦' },
                { name: 'Work in Kuwait', image: 'https://images.unsplash.com/photo-1573119574031-80390c957549?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇰🇼' },
                { name: 'Work in Singapore', image: 'https://images.pexels.com/photos/159746/notebook-pen-pencil-education-159746.jpeg', flag: '🇸🇬' },
                { name: 'Work in Australia', image: 'https://images.unsplash.com/photo-1600633349333-eebb43d01e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇦🇺' },
                { name: 'Work in Canada', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxpbnRlcm5hdGlvbmFsfGVufDB8fHxibHVlfDE3NTQzODIyOTV8MA&ixlib=rb-4.1.0&q=85', flag: '🇨🇦' },
                { name: 'Work in Japan', image: 'https://images.unsplash.com/photo-1641927420960-8059f26993d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85', flag: '🇯🇵' }
              ].map((destination, index) => (
                <div key={index} className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden rounded-2xl mb-4 shadow-xl">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg group-hover:text-green-300 transition-colors">
                        {destination.name.replace('Work in ', '')}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Support Services</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive support for your international journey. From application to settlement, we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Career Counseling', desc: 'Personalized career counseling to help you make informed decisions about your educational and professional pathways.' },
              { title: 'Course & University Selection', desc: 'Expert guidance in choosing the most suitable courses and universities for your career goals.' },
              { title: 'Test Preparations', desc: 'Comprehensive preparation for IELTS, TOEFL, GRE, GMAT and other standardized tests.' },
              { title: 'Visa Guidance', desc: 'Complete visa application support with high success rates and expert documentation assistance.' },
              { title: 'Loan & Financial Guidance', desc: 'Comprehensive support for education loans and financial planning for your studies abroad.' },
              { title: 'Pre-departure Briefing', desc: 'Essential preparation sessions to ensure you are ready for your journey abroad.' },
              { title: 'Accommodation Support', desc: 'Help finding suitable accommodation options in your destination country.' },
              { title: 'Immigration Services', desc: 'Expert immigration advice and support for permanent residency applications.' },
              { title: 'Spouse & Family Visa', desc: 'Guidance for family reunification and dependent visa applications.' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Our Testimonials</h2>
          <p className="text-xl text-center text-gray-600">What our clients say about us</p>
        </div>
        
        <div className="testimonial-scroll">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="testimonial-card bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mx-4 shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[400px] border border-blue-200">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-6 border-4 border-blue-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-blue-600 font-semibold">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-4">"{testimonial.content}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-2xl">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Scrolling University Partners */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Universities We Partner With</h2>
          <p className="text-xl text-center text-gray-600">Trusted partnerships worldwide</p>
        </div>
        
        <div className="partner-scroll">
          <div className="partner-track">
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="partner-logo bg-white rounded-xl p-6 mx-4 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-16 max-w-32 object-contain mb-3 mx-auto"
                  />
                  <p className="text-sm font-semibold text-gray-700">{partner.name}</p>
                  <p className="text-xs text-gray-500">{partner.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Got Questions?</h2>
          <p className="text-xl text-center text-gray-600 mb-16">We got the answers</p>
          
          <div className="space-y-6">
            {[
              {
                question: "What countries do you help students apply to?",
                answer: "Uddaan Consultancy assists students in applying to universities and work opportunities in Australia, UK, Canada, USA, New Zealand, Germany, France, Netherlands, UAE, Saudi Arabia, Qatar, Kuwait, Singapore, Japan and many more countries."
              },
              {
                question: "How long does the application process typically take?",
                answer: "The application process typically takes 3-6 months depending on the country, university, and course. For work visas, it can take 2-8 months. We provide detailed timelines for each application."
              },
              {
                question: "Can you help with scholarship applications?",
                answer: "Yes, we provide comprehensive scholarship guidance and help identify suitable scholarship opportunities based on your profile and chosen destination. We have partnerships with universities offering exclusive scholarships."
              },
              {
                question: "What is the processing time for visas?",
                answer: "Visa processing times vary by country: Australia (4-6 weeks), Canada (8-12 weeks), UK (3-6 weeks), USA (2-4 months), UAE (2-4 weeks), Qatar (3-6 weeks). We provide regular updates throughout the process."
              },
              {
                question: "Is it mandatory to take an English language test?",
                answer: "Most universities and employers require English proficiency tests like IELTS or TOEFL. However, some universities offer waivers based on previous education in English. For Gulf countries, Arabic knowledge is preferred but not always mandatory. We'll guide you based on your specific situation."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group">
                <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
                <div className="text-center bg-blue-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600 font-semibold">Successful Applications</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-green-600">50+</div>
                  <div className="text-gray-600 font-semibold">University Partners</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-purple-600">95%</div>
                  <div className="text-gray-600 font-semibold">Visa Success Rate</div>
                </div>
                <div className="text-center bg-orange-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-orange-600">10+</div>
                  <div className="text-gray-600 font-semibold">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573119574031-80390c957549?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb24lMjBjb25zdWx0YW5jeXxlbnwwfHx8Ymx1ZXwxNzU0MzgyMjg3fDA&ixlib=rb-4.1.0&q=85"
                alt="About us"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-6 bg-blue-500 p-3 rounded-full">📍</span>
                  <div>
                    <p className="font-medium text-lg">Address</p>
                    <p className="text-blue-200">123 Consultancy Street, Education City, EC 12345</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl mr-6 bg-green-500 p-3 rounded-full">📞</span>
                  <div>
                    <p className="font-medium text-lg">Phone</p>
                    <p className="text-blue-200">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl mr-6 bg-purple-500 p-3 rounded-full">✉️</span>
                  <div>
                    <p className="font-medium text-lg">Email</p>
                    <p className="text-blue-200">info@uddaanconsultancy.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl mr-6 bg-orange-500 p-3 rounded-full">🕒</span>
                  <div>
                    <p className="font-medium text-lg">Office Hours</p>
                    <p className="text-blue-200">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-6 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-4 focus:ring-blue-300 focus:outline-none placeholder-blue-200 backdrop-blur"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-6 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-4 focus:ring-blue-300 focus:outline-none placeholder-blue-200 backdrop-blur"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-6 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-4 focus:ring-blue-300 focus:outline-none placeholder-blue-200 backdrop-blur"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">Uddaan Consultancy</div>
              <p className="text-gray-300 mb-4">Bridging education and ambition.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">YouTube</a>
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
              <h4 className="text-lg font-semibold mb-4">Study & Work Abroad</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Study in Australia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study in UK</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Work in Dubai</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Work in Canada</a></li>
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
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>© Copyright Uddaan Consultancy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Application Form Modal */}
      {showApplicationForm && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {showSuccessMessage ? (
              <div className="text-center py-20">
                <div className="success-animation mb-8">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-6xl airplane-success">✈️</div>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h3>
                <p className="text-gray-600">We will contact you soon with further details.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Apply for {selectedOpportunity.title}</h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={submitApplication} className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicationData.applicant_name}
                      onChange={(e) => setApplicationData({...applicationData, applicant_name: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Available Countries *</label>
                    <select
                      multiple
                      required
                      value={applicationData.available_countries}
                      onChange={(e) => setApplicationData({
                        ...applicationData, 
                        available_countries: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none h-40 text-lg"
                    >
                      {countries.map(country => (
                        <option key={country.id} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple countries</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;