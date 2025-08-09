
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Briefcase, MessageSquare, Calendar, Settings, Plus, Edit, Trash2,
  Eye, Search, Filter, Download, Upload, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, Globe,
  Star, Award, Target, Activity, FileText, Image as ImageIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    jobs: [],
    applications: [],
    testimonials: [],
    events: [],
    settings: {},
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [activeTab, pagination.current, searchTerm, filters]);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/secure-admin-access-2024');
      return;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (activeTab === 'dashboard') {
        const response = await fetch('/api/admin/dashboard', { headers });
        const result = await response.json();
        if (result.success) {
          setData(prev => ({ ...prev, ...result }));
        }
      } else {
        const endpoint = getEndpointForTab(activeTab);
        const queryParams = new URLSearchParams({
          page: pagination.current,
          limit: 20,
          ...(searchTerm && { search: searchTerm }),
          ...filters
        });
        
        const response = await fetch(`${endpoint}?${queryParams}`, { headers });
        const result = await response.json();
        
        if (result.success) {
          setData(prev => ({ ...prev, [activeTab]: result[activeTab] || result.data }));
          if (result.pagination) {
            setPagination(result.pagination);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEndpointForTab = (tab) => {
    const endpoints = {
      jobs: '/api/admin/jobs',
      applications: '/api/admin/applications',
      testimonials: '/api/admin/testimonials',
      events: '/api/admin/events',
      settings: '/api/admin/settings'
    };
    return endpoints[tab] || '/api/admin/dashboard';
  };

  const handleCreate = async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = getEndpointForTab(activeTab);
      
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key]);
        }
      });
      
      if (selectedFile) {
        form.append('image', selectedFile);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${activeTab.slice(0, -1)} created successfully!`);
        setShowModal(false);
        setFormData({});
        setSelectedFile(null);
        fetchData();
      } else {
        toast.error(result.message || 'Creation failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Create error:', error);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = `${getEndpointForTab(activeTab)}/${id}`;
      
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key]);
        }
      });
      
      if (selectedFile) {
        form.append('image', selectedFile);
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${activeTab.slice(0, -1)} updated successfully!`);
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        setSelectedFile(null);
        fetchData();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getEndpointForTab(activeTab)}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${activeTab.slice(0, -1)} deleted successfully!`);
        fetchData();
      } else {
        toast.error(result.message || 'Deletion failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Delete error:', error);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs"
          value={data.stats?.jobs?.total || 0}
          subtitle={`${data.stats?.jobs?.active || 0} active`}
          icon={<Briefcase className="w-8 h-8" />}
          trend={"+12%"}
          color="blue"
        />
        <StatCard
          title="Applications"
          value={data.stats?.applications?.total || 0}
          subtitle={`${data.stats?.applications?.new || 0} new`}
          icon={<Users className="w-8 h-8" />}
          trend={"+8%"}
          color="green"
        />
        <StatCard
          title="Testimonials"
          value={data.stats?.testimonials?.total || 0}
          subtitle="Published reviews"
          icon={<Star className="w-8 h-8" />}
          trend={"+5%"} 
          color="yellow"
        />
        <StatCard
          title="Events"
          value={data.stats?.events?.total || 0}
          subtitle={`${data.stats?.events?.upcoming || 0} upcoming`}
          icon={<Calendar className="w-8 h-8" />}
          trend={"+15%"}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Applications</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyStats?.applications || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Job Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topJobs?.slice(0, 5) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#10B981" />
              <Bar dataKey="views" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {(data.recentApplications || []).slice(0, 5).map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-sm text-gray-600">{app.jobId?.title}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Jobs</h3>
          <div className="space-y-4">
            {(data.topJobs || []).slice(0, 5).map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{job.applications} apps</p>
                  <p className="text-sm text-gray-500">{job.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => {
    const columns = getColumnsForTab(activeTab);
    const rows = data[activeTab] || [];

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => openModal('create')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(row, column)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal('edit', row)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.current} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current === pagination.total}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getColumnsForTab = (tab) => {
    const columns = {
      jobs: [
        { key: 'title', label: 'Title' },
        { key: 'company', label: 'Company' },
        { key: 'country', label: 'Country' },
        { key: 'jobType', label: 'Type' },
        { key: 'applications', label: 'Applications' },
        { key: 'views', label: 'Views' },
        { key: 'isActive', label: 'Status' }
      ],
      applications: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'jobId.title', label: 'Job Title' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Applied Date' }
      ],
      testimonials: [
        { key: 'name', label: 'Name' },
        { key: 'position', label: 'Position' },
        { key: 'company', label: 'Company' },
        { key: 'rating', label: 'Rating' },
        { key: 'isActive', label: 'Status' }
      ],
      events: [
        { key: 'title', label: 'Title' },
        { key: 'eventType', label: 'Type' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'location', label: 'Location' },
        { key: 'isActive', label: 'Status' }
      ]
    };
    return columns[tab] || [];
  };

  const renderCellContent = (row, column) => {
    const value = column.key.includes('.') 
      ? column.key.split('.').reduce((obj, key) => obj?.[key], row)
      : row[column.key];

    switch (column.key) {
      case 'isActive':
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? 'Active' : 'Inactive'}
          </span>
        );
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
            {value}
          </span>
        );
      case 'createdAt':
      case 'startDate':
        return new Date(value).toLocaleDateString();
      case 'rating':
        return (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        );
      default:
        return value?.toString() || '-';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-600 ml-1">{trend}</span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/app_logo-removebg-preview.png" alt="Uddaan" className="w-8 h-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back, Admin</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  navigate('/secure-admin-access-2024');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <ul className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
                  { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
                  { id: 'applications', label: 'Applications', icon: <Users className="w-4 h-4" /> },
                  { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare className="w-4 h-4" /> },
                  { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
                ].map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'dashboard' ? (
              renderDashboard()
            ) : (
              renderTable()
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {modalType === 'create' ? 'Create' : 'Edit'} {activeTab.slice(0, -1)}
              </h3>
            </div>
            <div className="p-6">
              <DynamicForm
                type={activeTab}
                data={formData}
                onChange={setFormData}
                onFileChange={setSelectedFile}
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modalType === 'create') {
                    handleCreate(formData);
                  } else {
                    handleUpdate(editingItem._id, formData);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalType === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dynamic Form Component
const DynamicForm = ({ type, data, onChange, onFileChange }) => {
  const getFormFields = () => {
    const fields = {
      jobs: [
        { name: 'title', type: 'text', label: 'Job Title', required: true },
        { name: 'company', type: 'text', label: 'Company', required: true },
        { name: 'country', type: 'text', label: 'Country', required: true },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'jobType', type: 'select', label: 'Job Type', options: ['work', 'study', 'both'], required: true },
        { name: 'programType', type: 'select', label: 'Program Type', options: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Work'] },
        { name: 'salary', type: 'text', label: 'Salary/Fee' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'requirements', type: 'textarea', label: 'Requirements (comma-separated)' },
        { name: 'contactEmail', type: 'email', label: 'Contact Email' },
        { name: 'duration', type: 'text', label: 'Duration' },
        { name: 'applicationDeadline', type: 'date', label: 'Application Deadline' },
        { name: 'universityWebsite', type: 'url', label: 'Website URL' },
        { name: 'scholarships', type: 'checkbox', label: 'Scholarships Available' },
        { name: 'featured', type: 'checkbox', label: 'Featured Job' },
        { name: 'isActive', type: 'checkbox', label: 'Active' },
        { name: 'universityLogo', type: 'file', label: 'Logo/Image' }
      ],
      testimonials: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'position', type: 'text', label: 'Position', required: true },
        { name: 'company', type: 'text', label: 'Company', required: true },
        { name: 'country', type: 'text', label: 'Country' },
        { name: 'testimonial', type: 'textarea', label: 'Testimonial', required: true },
        { name: 'rating', type: 'number', label: 'Rating (1-5)', min: 1, max: 5 },
        { name: 'featured', type: 'checkbox', label: 'Featured' },
        { name: 'isActive', type: 'checkbox', label: 'Active' },
        { name: 'image', type: 'file', label: 'Photo' }
      ],
      events: [
        { name: 'title', type: 'text', label: 'Event Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
        { name: 'shortDescription', type: 'text', label: 'Short Description' },
        { name: 'eventType', type: 'select', label: 'Event Type', options: ['workshop', 'seminar', 'webinar', 'conference', 'news', 'announcement'] },
        { name: 'startDate', type: 'datetime-local', label: 'Start Date', required: true },
        { name: 'endDate', type: 'datetime-local', label: 'End Date', required: true },
        { name: 'location', type: 'text', label: 'Location' },
        { name: 'online', type: 'checkbox', label: 'Online Event' },
        { name: 'meetingLink', type: 'url', label: 'Meeting Link' },
        { name: 'maxParticipants', type: 'number', label: 'Max Participants' },
        { name: 'featured', type: 'checkbox', label: 'Featured' },
        { name: 'isActive', type: 'checkbox', label: 'Active' },
        { name: 'image', type: 'file', label: 'Event Image' }
      ]
    };
    return fields[type] || [];
  };

  const handleInputChange = (name, value) => {
    onChange(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    onFileChange(e.target.files[0]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {getFormFields().map((field) => (
        <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={data[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={data[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            />
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={data[field.name] || false}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Yes</span>
            </div>
          ) : field.type === 'file' ? (
            <input
              type="file"
              onChange={handleFileChange}
              accept={field.name === 'image' ? 'image/*' : '*'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <input
              type={field.type}
              value={data[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              min={field.min}
              max={field.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
