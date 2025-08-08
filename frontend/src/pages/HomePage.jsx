import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Users, Globe, Award, Shield, Quote } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    country: '',
    jobType: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.country) params.append('country', searchData.country);
    if (searchData.jobType) params.append('jobType', searchData.jobType);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const countries = [
    'UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Oman', 'Bahrain'
  ];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Temporary'
  ];

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Opportunities",
      description: "Access to job opportunities in Gulf countries and beyond"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Professional support throughout your application process"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Process",
      description: "Safe and reliable job placement with verified employers"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Support",
      description: "Dedicated team to assist you throughout your journey"
    }
  ];

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "50+", label: "Partner Companies" },
    { number: "15+", label: "Countries" },
    { number: "98%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      name: 'Prabha Dhital',
      role: 'Visa Success, Canada',
      quote: 'Udaan Agencies made the entire process seamless with the right guidance and support.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612681a?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Ved Thapa',
      role: 'Software Developer, Australia',
      quote: 'Their accurate information helped me secure my dream job abroad.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Sarah Johnson',
      role: 'Masters Graduate, UK',
      quote: 'Comprehensive support from start to finish. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="hero-premium py-20 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Dream Job Abroad
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Nepali applicants can explore vacancies across Gulf countries and apply instantly
          </p>
          
          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Country Selection */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type Selection */}
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="">Select Job Type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="btn-premium flex items-center justify-center space-x-2 text-lg"
                >
                  <Search className="w-5 h-5" />
                  <span>Find Jobs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Why Choose Udaan Agencies?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support to help you achieve your international dreams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="testimonial-card-premium text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials in Home */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real stories from successful Nepali applicants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card-premium">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="text-gray-700">
                  <Quote className="inline w-5 h-5 text-blue-500 mr-2" />
                  <span>{t.quote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Success Story</h2>
            <p className="text-xl opacity-90">
              Numbers that speak for our commitment and success
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-bounce-gentle">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join hundreds of successful professionals who have achieved their international career goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className="btn-premium flex items-center space-x-2"
            >
              <span>Browse Job Opportunities</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/consultation')}
              className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
            >
              Schedule Consultation
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 