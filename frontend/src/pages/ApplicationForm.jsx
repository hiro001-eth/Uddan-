import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Send, ArrowLeft, CheckCircle } from 'lucide-react';

const ApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State for form data and submission status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    coverLetter: '',
    resume: null
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  useEffect(() => {
    // Simulate fetching job details
    const fetchJob = async () => {
      try {
        // In a real app, this would be an API call
        const sampleJob = {
          id: jobId,
          title: "Software Engineer",
          company: "TechCorp Dubai",
          country: "UAE",
          salary: "$4000-6000/month"
        };
        setJob(sampleJob);

        // Pre-fill form data if jobId is available
        setFormData(prev => ({ ...prev, country: sampleJob.country || '' }));

      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  // Handler for the submit button, updated for new API structure
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Split name into firstName and lastName
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Add job ID
      formDataToSend.append('jobId', jobId);
      formDataToSend.append('firstName', firstName);
      formDataToSend.append('lastName', lastName);
      formDataToSend.append('email', data.email);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('nationality', data.country);
      formDataToSend.append('currentLocation[country]', data.country); // Assuming nationality and current country are the same for simplicity
      formDataToSend.append('currentLocation[city]', 'Not specified'); // Default city, can be updated
      formDataToSend.append('coverLetter', data.additionalInfo || '');

      if (data.resume && data.resume.length > 0) {
        formDataToSend.append('resume', data.resume[0]);
      }

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Submit failed');
      }

      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in the {job.title} position at {job.company}.
              Our team will review your application and contact you within 24-48 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full btn-premium"
              >
                Browse More Jobs
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Job</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Apply for Position</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>{job.country}</span>
                <span>•</span>
                <span>{job.salary}</span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Application</h3>
              <p className="text-gray-600">
                Provide your contact information and we'll get back to you with next steps
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="form-label-premium flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="form-input-premium"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="form-label-premium flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className="form-input-premium"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="form-label-premium flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  className="form-input-premium"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Country / Nationality */}
              <div>
                <label className="form-label-premium">
                  Country / Nationality *
                </label>
                <input
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className="form-input-premium"
                  placeholder="Enter your country of residence or nationality"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>


              {/* Additional Information */}
              <div>
                <label className="form-label-premium">
                  Additional Information (Optional)
                </label>
                <textarea
                  {...register('additionalInfo')}
                  rows={4}
                  className="form-input-premium"
                  placeholder="Tell us about your experience, skills, or any other relevant information..."
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="form-label-premium">
                  Upload Resume (Optional)
                </label>
                <input
                  type="file"
                  {...register('resume')}
                  className="form-input-premium file:bg-blue-500 file:text-white file:border-0 file:cursor-pointer file:rounded-md file:px-3 file:py-2 file:mr-4"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInputChange} // Ensure this is linked to formData state if not using react-hook-form directly for file
                />
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-premium w-full flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </form>

            {/* Information Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">What happens next?</h4>
                  <p className="text-sm text-blue-700">
                    After submitting your application, our team will review your information and contact you within 24-48 hours to discuss the next steps in the application process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;