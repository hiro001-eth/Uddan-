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

  // Sample job data focused on Gulf countries and realistic positions
  const sampleJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp Dubai",
      country: "UAE",
      jobType: "Full-time",
      salary: "$4000-6000/month",
      description: "We are looking for a skilled Software Engineer to join our dynamic team in Dubai. Experience with React, Node.js, and cloud technologies required.",
      requirements: ["3+ years experience", "React/Node.js", "Cloud platforms", "English fluency"],
      contactEmail: "hr@techcorp.ae",
      universityLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
      universityWebsite: "https://techcorp.ae",
      isActive: true,
      featured: true,
      views: 245,
      applications: 18,
      postedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "Global Retail Qatar",
      country: "Qatar",
      jobType: "Full-time",
      salary: "$3500-5000/month",
      description: "Join our marketing team in Doha. Lead digital marketing campaigns and brand development for our retail operations across Qatar.",
      requirements: ["5+ years experience", "Digital marketing", "Team leadership", "Arabic preferred"],
      contactEmail: "careers@globalretail.qa",
      universityLogo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100",
      universityWebsite: "https://globalretail.qa",
      isActive: true,
      featured: true,
      views: 189,
      applications: 12,
      postedDate: "2024-01-20"
    },
    {
      id: 3,
      title: "Accountant",
      company: "Finance Solutions Saudi",
      country: "Saudi Arabia",
      jobType: "Full-time",
      salary: "$3000-4500/month",
      description: "Experienced accountant needed for our Riyadh office. Handle financial reporting, tax compliance, and budgeting for our growing company.",
      requirements: ["CPA/ACCA", "3+ years experience", "SAP knowledge", "Arabic fluency"],
      contactEmail: "hr@financesolutions.sa",
      universityLogo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100",
      universityWebsite: "https://financesolutions.sa",
      isActive: true,
      featured: false,
      views: 156,
      applications: 8,
      postedDate: "2024-01-25"
    },
    {
      id: 4,
      title: "Nurse",
      company: "Medical Center Kuwait",
      country: "Kuwait",
      jobType: "Full-time",
      salary: "$2500-4000/month",
      description: "Registered nurses needed for our state-of-the-art medical facility in Kuwait City. Excellent benefits and career growth opportunities.",
      requirements: ["BSN degree", "2+ years experience", "Valid license", "English/Arabic"],
      contactEmail: "nursing@medicalcenter.kw",
      universityLogo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100",
      universityWebsite: "https://medicalcenter.kw",
      isActive: true,
      featured: false,
      views: 203,
      applications: 15,
      postedDate: "2024-01-30"
    },
    {
      id: 5,
      title: "Construction Supervisor",
      company: "BuildCorp Oman",
      country: "Oman",
      jobType: "Full-time",
      salary: "$2800-4200/month",
      description: "Supervise construction projects in Muscat. Manage teams, ensure safety standards, and coordinate with clients and contractors.",
      requirements: ["Civil engineering degree", "5+ years experience", "Safety certification", "Leadership skills"],
      contactEmail: "construction@buildcorp.om",
      universityLogo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100",
      universityWebsite: "https://buildcorp.om",
      isActive: true,
      featured: false,
      views: 134,
      applications: 6,
      postedDate: "2024-02-05"
    },
    {
      id: 6,
      title: "Hotel Manager",
      company: "Luxury Hotels Bahrain",
      country: "Bahrain",
      jobType: "Full-time",
      salary: "$3200-4800/month",
      description: "Manage operations for our luxury hotel in Manama. Oversee staff, guest services, and ensure exceptional customer experience.",
      requirements: ["Hospitality degree", "3+ years management", "Customer service", "Multilingual"],
      contactEmail: "careers@luxuryhotels.bh",
      universityLogo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100",
      universityWebsite: "https://luxuryhotels.bh",
      isActive: true,
      featured: false,
      views: 167,
      applications: 9,
      postedDate: "2024-02-10"
    },
    {
      id: 7,
      title: "Sales Executive",
      company: "Tech Solutions UAE",
      country: "UAE",
      jobType: "Full-time",
      salary: "$2500-4000/month",
      description: "Drive sales for our technology solutions in Dubai. Build client relationships and achieve sales targets in the competitive tech market.",
      requirements: ["Sales experience", "Tech knowledge", "Communication skills", "Target-driven"],
      contactEmail: "sales@techsolutions.ae",
      universityLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100",
      universityWebsite: "https://techsolutions.ae",
      isActive: true,
      featured: false,
      views: 145,
      applications: 11,
      postedDate: "2024-02-15"
    },
    {
      id: 8,
      title: "Teacher",
      company: "International School Qatar",
      country: "Qatar",
      jobType: "Full-time",
      salary: "$3000-4500/month",
      description: "Join our international school in Doha. Teach English, Math, or Science to diverse student body. Excellent benefits and professional development.",
      requirements: ["Teaching degree", "2+ years experience", "English fluency", "International experience"],
      contactEmail: "teaching@internationalschool.qa",
      universityLogo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100",
      universityWebsite: "https://internationalschool.qa",
      isActive: true,
      featured: false,
      views: 178,
      applications: 13,
      postedDate: "2024-02-20"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(sampleJobs);
      setLoading(false);
    }, 1000);
  }, []);

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