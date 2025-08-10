import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Building, CheckCircle, ArrowLeft } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const stateJob = location.state && location.state.job;

  const [job, setJob] = useState(stateJob || null);
  const [loading, setLoading] = useState(!stateJob);

  useEffect(() => {
    if (stateJob) return; // already have job from state
    const controller = new AbortController();
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${id}`, { signal: controller.signal });
        const data = await res.json();
        if (data.success && data.job) {
          const j = data.job;
          setJob({
            id: j._id,
            title: j.title,
            company: j.company,
            country: j.country,
            salary: j.salary,
            description: j.description,
            requirements: j.requirements || []
          });
        } else {
          setJob(null);
        }
      } catch (e) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    return () => controller.abort();
  }, [id, stateJob]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Browse Other Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building className="w-5 h-5 mr-2" />
                <span className="text-lg">{job.company}</span>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.country}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <DollarSign className="w-5 h-5 mr-3 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">{job.salary}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">Recently</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Take the first step towards your international opportunity. Our team will guide you through the application process.
          </p>
          <Link
            to={`/apply/${job.id || id}`}
            state={{ job }}
            className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 