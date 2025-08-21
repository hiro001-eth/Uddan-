
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Building, DollarSign, Clock, Eye, Users, 
  Star, ArrowRight, Globe, Calendar, Briefcase 
} from 'lucide-react';

const JobCard = ({ job, featured = false, index = 0 }) => {
  if (!job) return null;

  const {
    id,
    title,
    company,
    country,
    city,
    jobType,
    salaryMin,
    salaryMax,
    currency,
    description,
    views = 0,
    applications = 0,
    createdAt,
    featured: isFeatured,
    urgent,
    workPermitSponsorship,
    accommodationProvided,
    transportationProvided
  } = job;

  const formatSalary = () => {
    if (!salaryMin && !salaryMax) return 'Competitive Salary';
    
    const curr = currency || 'USD';
    if (salaryMin && salaryMax) {
      return `${curr} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}/month`;
    }
    return `${curr} ${(salaryMin || salaryMax)?.toLocaleString()}/month`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const benefits = [];
  if (workPermitSponsorship) benefits.push('Visa Sponsorship');
  if (accommodationProvided) benefits.push('Accommodation');
  if (transportationProvided) benefits.push('Transportation');

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-500 ${
        isFeatured ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            <Star className="h-3 w-3 fill-current" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Urgent Badge */}
      {urgent && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            Urgent
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center space-x-2 mt-2 text-gray-600">
                <Building className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{company}</span>
              </div>
            </div>
          </div>

          {/* Location & Type */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{city ? `${city}, ${country}` : country}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Briefcase className="h-4 w-4 text-green-500" />
              <span className="capitalize">{jobType}</span>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-green-600">{formatSalary()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {description || 'Join our dynamic team and take your career to the next level with exciting opportunities in the Gulf region.'}
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {benefits.slice(0, 3).map((benefit, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{applications} applied</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/jobs/${id}`}
          className="group/btn w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default JobCard;
