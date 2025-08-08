import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, DollarSign, Calendar, Users, Eye, Briefcase } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="job-card-premium group">
      {/* Header with Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>
          {job.featured && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Job Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{job.country}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-green-500" />
            <span>{job.jobType}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-800">{job.salary}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Requirements */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span key={index} className="badge badge-primary text-xs">
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="badge badge-primary text-xs">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{job.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{job.applications} applications</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
        <div className="flex space-x-3">
          <Link
            to={`/jobs/${job.id}`}
            state={{ job }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center"
          >
            View Details
          </Link>
          <Link
            to={`/apply/${job.id}`}
            state={{ job }}
            className="flex-1 btn-premium text-center"
          >
            Quick Apply
          </Link>
          </div>
          <div className="text-sm text-gray-600 text-center">
            <span className="block">Don\'t see the perfect opportunity?</span>
            <div className="mt-2 flex gap-2 justify-center">
              <Link to="/contact" className="underline hover:text-blue-600">Contact Our Team</Link>
              <span>•</span>
              <Link to="/consultation" className="underline hover:text-purple-600">Schedule Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 