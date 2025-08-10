import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Building, DollarSign, Calendar, Users } from 'lucide-react';
import JobCard from '../components/JobCard';

const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    jobType: searchParams.get('jobType') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.country) params.append('country', filters.country);
        if (filters.jobType) params.append('jobType', filters.jobType);
        if (filters.search) params.append('search', filters.search);
        params.append('limit', '50');
        const res = await fetch(`/api/jobs?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        if (data.success) {
          const mapped = (data.jobs || []).map(j => ({
            id: j._id,
            title: j.title,
            company: j.company,
            country: j.country,
            jobType: j.jobType,
            salary: j.salary,
            description: j.description,
            requirements: j.requirements || [],
            contactEmail: j.contactEmail,
            universityLogo: j.universityLogo,
            universityWebsite: j.universityWebsite,
            isActive: j.isActive,
            featured: j.featured,
            views: j.views || 0,
            applications: j.applications || 0,
            postedDate: j.createdAt
          }));
          setJobs(mapped);
        } else {
          setJobs([]);
        }
      } catch (e) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    return () => controller.abort();
  }, [filters.country, filters.jobType, filters.search]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCountry = !filters.country || job.country === filters.country;
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCountry && matchesJobType && matchesSearch;
  });

  const countries = [...new Set(jobs.map(job => job.country))];
  const jobTypes = [...new Set(jobs.map(job => job.jobType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Dream Job Abroad
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover exciting career opportunities in Gulf countries and beyond
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Job Type Filter */}
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setFilters({ country: '', jobType: '', search: '' });
                setSearchParams({});
              }}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} Job Opportunities Found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filtered Results</span>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Apply?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't see the perfect opportunity? Contact us for personalized job matching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-premium" onClick={() => navigate('/contact')}>
              Contact Our Team
            </button>
            <button className="bg-white/20 hover:bg-white/25 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300" onClick={() => navigate('/consultation')}>
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobListPage; 