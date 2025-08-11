
import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

const JobFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    country: 'UAE',
    city: '',
    jobType: 'Full-time',
    category: 'IT',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requirements: [''],
    benefits: [''],
    experienceLevel: 'Mid Level',
    education: 'Bachelor',
    contactEmail: '',
    contactPhone: '',
    applicationDeadline: '',
    startDate: '',
    featured: false,
    urgent: false,
    workPermitSponsorship: false,
    accommodationProvided: false,
    transportationProvided: false,
    tags: [''],
    isActive: true
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        applicationDeadline: initialData.applicationDeadline ? 
          new Date(initialData.applicationDeadline).toISOString().split('T')[0] : '',
        startDate: initialData.startDate ? 
          new Date(initialData.startDate).toISOString().split('T')[0] : '',
        requirements: initialData.requirements?.length ? initialData.requirements : [''],
        benefits: initialData.benefits?.length ? initialData.benefits : [''],
        tags: initialData.tags?.length ? initialData.tags : ['']
      });
    }
  }, [initialData]);

  const countries = ['UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Oman', 'Bahrain', 'Jordan', 'Lebanon', 'Other'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote'];
  const categories = ['Engineering', 'Healthcare', 'Education', 'Finance', 'Marketing', 'Sales', 'Construction', 'Hospitality', 'IT', 'Other'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD', 'Certification', 'Not Required'];
  const currencies = ['USD', 'AED', 'QAR', 'SAR', 'KWD', 'OMR', 'BHD'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // prevent non-numeric in salary fields
    if ((name === 'salaryMin' || name === 'salaryMax') && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    // City is optional
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    // Make salary optional; validate only if provided
    if (formData.salaryMin && formData.salaryMin <= 0) newErrors.salaryMin = 'Minimum salary must be positive';
    if (formData.salaryMax && formData.salaryMax <= 0) newErrors.salaryMax = 'Maximum salary must be positive';
    if (formData.salaryMin && formData.salaryMax && parseInt(formData.salaryMin, 10) > parseInt(formData.salaryMax, 10)) {
      newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Map to backend schema and sanitize
    const cleanedData = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      country: formData.country,
      city: formData.city?.trim() || undefined,
      jobType: formData.jobType,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin, 10) : undefined,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax, 10) : undefined,
      description: formData.description.trim(),
      requirements: formData.requirements.filter(r => r.trim()).join('\n'),
      benefits: formData.benefits.filter(b => b.trim()).join('\n'),
      contactEmail: formData.contactEmail.trim(),
      status: formData.isActive ? 'open' : 'draft',
      featured: !!formData.featured,
    };

    onSubmit(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Job' : 'Create New Job'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., TechCorp Dubai"
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Dubai"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary *
              </label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salaryMin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="3000"
                min="0"
              />
              {errors.salaryMin && <p className="text-red-500 text-sm mt-1">{errors.salaryMin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary *
              </label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salaryMax ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5000"
                min="0"
              />
              {errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax}</p>}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Detailed job description..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter requirement..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'requirements')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Requirement</span>
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter benefit..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'benefits')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Benefit</span>
            </button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="hr@company.com"
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+971-4-123-4567"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Requirement
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Featured Job</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Urgent</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="workPermitSponsorship"
                checked={formData.workPermitSponsorship}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Visa Sponsorship</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="accommodationProvided"
                checked={formData.accommodationProvided}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Accommodation</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="transportationProvided"
                checked={formData.transportationProvided}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Transportation</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
