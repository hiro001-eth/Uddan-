import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, FileText, Plus, Edit, Trash2, 
  Eye, Mail, Phone, Calendar, MapPin, LogOut,
  TrendingUp, CheckCircle, Clock, XCircle, Settings,
  Shield, Database, BarChart3, Globe, Award, Star,
  Search, Filter, Download, Upload, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  // CRUD modal states
  const [jobForm, setJobForm] = useState({ title: '', company: '', country: '', jobType: 'work' });
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', content: '' });
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '' });
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  // Default preview data for all sections
  const SAMPLE = {
    jobs: [
      { _id: 'j1', title: 'PhD in Data Science', company: 'University of Waterloo', country: 'Canada', jobType: 'study', views: 10, applications: 0, programType: 'PhD' },
      { _id: 'j2', title: 'Bachelor of Business Administration', company: 'University of British Columbia', country: 'Canada', jobType: 'study', views: 24, applications: 2, programType: 'Bachelor' },
      { _id: 'j3', title: 'Software Developer', company: 'TechCorp Canada', country: 'Canada', jobType: 'work', views: 12, applications: 1, programType: 'Full-time' },
      { _id: 'j4', title: 'Master of Computer Science', company: 'University of Toronto', country: 'Canada', jobType: 'study', views: 0, applications: 0, programType: 'Master' },
    ],
    applications: [
      { _id: 'a1', name: 'John Doe', email: 'john@example.com', phone: '+123456789', status: 'new', createdAt: new Date().toISOString(), jobId: { title: 'Software Developer' } },
      { _id: 'a2', name: 'Aarav Singh', email: 'aarav@example.com', phone: '+977-1-4444444', status: 'reviewed', createdAt: new Date().toISOString(), jobId: { title: 'PhD in Data Science' } },
    ],
    testimonials: [
      { _id: 't1', name: 'Prabha Dhital', content: 'Great support and guidance!', rating: 5 },
      { _id: 't2', name: 'Suman Shrestha', content: 'Highly recommend Uddaan Agencies.', rating: 5 },
      { _id: 't3', name: 'Anita Karki', content: 'Professional and helpful team.', rating: 5 },
    ],
    events: [
      { _id: 'e1', title: 'Job Fair Qatar 2025', date: new Date().toISOString(), location: 'Doha, Qatar' },
      { _id: 'e2', title: 'Canada Study Expo', date: new Date().toISOString(), location: 'Toronto, Canada' },
    ],
    media: [
      { _id: 'm1', name: 'hero.jpg', type: 'image/jpeg', size: '220KB' },
      { _id: 'm2', name: 'logo.png', type: 'image/png', size: '12KB' },
    ],
    pages: [
      { _id: 'p1', slug: 'home', title: 'Home' },
      { _id: 'p2', slug: 'about', title: 'About' },
      { _id: 'p3', slug: 'contact', title: 'Contact' },
    ],
    policies: [
      { _id: 'pol1', key: 'privacy-policy', title: 'Privacy Policy' },
      { _id: 'pol2', key: 'terms-of-service', title: 'Terms of Service' },
      { _id: 'pol3', key: 'cookie-policy', title: 'Cookie Policy' },
    ],
    users: [
      { _id: 'u1', email: 'admin@uddaan.com', roles: ['admin'], mfa_enabled: false },
      { _id: 'u2', email: 'editor@uddaan.com', roles: ['editor'], mfa_enabled: true },
    ],
    audit: [
      { _id: 'log1', action: 'job.create', model: 'jobs', model_id: 'j1', createdAt: new Date().toISOString() },
      { _id: 'log2', action: 'application.update', model: 'applications', model_id: 'a2', createdAt: new Date().toISOString() },
    ],
  };
  const [chartData, setChartData] = useState({ appsLast7: [], jobsByCountry: [] });

  const wsRef = useRef(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/secure-admin-access-2024');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Prefer admin DB endpoints; fallback to public endpoints, then SAMPLE
      const adminDbUrl = 'http://127.0.0.1:8000/admin/api/db';
      const headers = { 'Content-Type': 'application/json', 'x-admin-token': 'change-me' };
      const adminFind = async (collection) => {
        try {
          const r = await fetch(`${adminDbUrl}/find`, { method: 'POST', headers, body: JSON.stringify({ collection, filter: {}, limit: 200 }) });
          if (!r.ok) return [];
          const j = await r.json();
          return j.items || [];
        } catch { return []; }
      };
      const [jobsDb, testimonialsDb, eventsDb, settingsDb] = await Promise.all([
        adminFind('jobs'), adminFind('testimonials'), adminFind('events'), adminFind('settings')
      ]);

      if (jobsDb.length) setJobs(jobsDb); else {
        // Fallback public
        try {
          const r = await fetch('/api/jobs'); const d = await r.json(); setJobs(d.jobs || d || SAMPLE.jobs);
        } catch { setJobs(SAMPLE.jobs); }
      }
      setApplications(SAMPLE.applications);
      setTestimonials(testimonialsDb.length ? testimonialsDb : SAMPLE.testimonials);
      setEvents(eventsDb.length ? eventsDb : SAMPLE.events);
      const settingsObj = (settingsDb || []).reduce((acc, s) => { if (s.key) acc[s.key] = s.value; return acc; }, {});
      setSettings(Object.keys(settingsObj).length ? settingsObj : { brand: 'Uddaan Agencies', theme: 'blue' });

      // Build lightweight chart data
      const appsArray = (applicationsData.applications || applicationsData || []).map(a => ({
        createdAt: a.createdAt || a.applied_at || new Date().toISOString(),
      }));
      const today = new Date();
      const days = [...Array(7)].map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        return { key, label: d.toLocaleDateString('en-US', { weekday: 'short' }), count: 0 };
      });
      appsArray.forEach(a => {
        const k = (new Date(a.createdAt)).toISOString().slice(0, 10);
        const idx = days.findIndex(d => d.key === k);
        if (idx >= 0) days[idx].count += 1;
      });
      const jobsByCountryMap = {};
      (jobsData.jobs || jobsData || []).forEach(j => {
        const c = j.country || 'Unknown';
        jobsByCountryMap[c] = (jobsByCountryMap[c] || 0) + 1;
      });
      const jobsByCountry = Object.entries(jobsByCountryMap)
        .sort((a,b)=> b[1]-a[1])
        .slice(0, 6)
        .map(([country, count]) => ({ country, count }));
      setChartData({ appsLast7: days, jobsByCountry });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-green-100 text-green-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: Clock,
      reviewed: Eye,
      contacted: Mail,
      accepted: CheckCircle,
      rejected: XCircle
    };
    return icons[status] || Clock;
  };

  const handleSecurityAccess = () => {
    if (adminPassword === 'uddaan-secure-2024') {
      toast.success('Security access granted');
      setShowPassword(false);
    } else {
      toast.error('Invalid security code');
    }
  };

  const content = (
    <div className="min-h-screen">
      {/* Header now in AdminLayout */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="flex space-x-1 bg-blue-50/10 rounded-xl p-1 shadow-sm mb-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'jobs', name: 'Jobs/Programs', icon: Briefcase },
            { id: 'applications', name: 'Applications', icon: FileText },
            { id: 'media', name: 'Media Manager', icon: Upload },
            { id: 'pages', name: 'Pages', icon: Database },
            { id: 'events', name: 'Events', icon: Calendar },
            { id: 'policies', name: 'Policies', icon: Shield },
            { id: 'theme', name: 'Theme & Fonts', icon: Globe },
            { id: 'users', name: 'Users & Roles', icon: Users },
            { id: 'testimonials', name: 'Testimonials', icon: Star },
            { id: 'settings', name: 'Settings', icon: Settings },
            { id: 'audit', name: 'Audit Logs', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600/90 text-white shadow-lg'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Security Modal */}
        {showPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Security Access</h3>
                <p className="text-gray-600">Enter security code to access advanced features</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Code
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter security code"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSecurityAccess}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
                  >
                    Verify Access
                  </button>
                  <button
                    onClick={() => setShowPassword(false)}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Testimonials</p>
                    <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Events</p>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Applications Last 7 Days (bar chart) */}
              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications (Last 7 Days)</h3>
                <div className="h-48 flex items-end gap-3">
                  {chartData.appsLast7.map((d, idx) => {
                    const max = Math.max(1, ...chartData.appsLast7.map(x => x.count));
                    const h = (d.count / max) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-100 rounded-t-md" style={{ height: `${Math.max(6, h)}%` }}></div>
                        <div className="mt-2 text-xs text-gray-600">{d.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-sm text-gray-500">Total: {chartData.appsLast7.reduce((s, x) => s + x.count, 0)}</div>
              </div>

              {/* Jobs by Country (horizontal bars) */}
              <div className="bg-blue-50/10 rounded-2xl shadow-sm p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries by Programs</h3>
                <div className="space-y-3">
                  {chartData.jobsByCountry.map((row, i) => {
                    const max = Math.max(1, ...chartData.jobsByCountry.map(x => x.count));
                    const w = (row.count / max) * 100;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{row.country}</span>
                          <span className="text-gray-500">{row.count}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-md overflow-hidden">
                          <div className="h-3 bg-blue-500" style={{ width: `${w}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {chartData.jobsByCountry.length === 0 && (
                    <div className="text-sm text-gray-500">No data yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 bg-blue-50/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {application.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{application.name}</p>
                          <p className="text-sm text-gray-600">{application.email}</p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Programs</h3>
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-blue-50/10 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{job.views || 0} views</p>
                        <p className="text-xs text-gray-600">{job.applications || 0} applications</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Management */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Program Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Program</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                              <Briefcase className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-500">{job.programType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.country}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getStatusBadge(job.jobType)}`}>
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{job.views || 0} views</div>
                          <div>{job.applications || 0} applications</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Applications Management */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Application Management</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-600 font-semibold">
                                {application.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.name}</div>
                              <div className="text-sm text-gray-500">{application.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.jobId?.title || 'Program not found'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <a href={`mailto:${application.email}`} className="text-primary-600 hover:text-primary-900">
                              <Mail className="w-4 h-4" />
                            </a>
                            <a href={`tel:${application.phone}`} className="text-primary-600 hover:text-primary-900">
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getStatusBadge(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonials</h3>
            <div className="space-y-3">
              {(testimonials.length ? testimonials : SAMPLE.testimonials).map(t => (
                <div key={t._id} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events</h3>
            <div className="space-y-3">
              {(events.length ? events : SAMPLE.events).map(e => (
                <div key={e._id} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="font-semibold text-gray-900">{e.title}</div>
                  <div className="text-sm text-gray-600">{new Date(e.date).toLocaleString()} — {e.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600">Brand</div>
                <div className="font-semibold text-gray-900">{(settings.brand || 'Uddaan Agencies')}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600">Theme</div>
                <div className="font-semibold text-gray-900">{(settings.theme || 'blue')}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Manager</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE.media.map(m => (
                <div key={m._id} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="font-semibold text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.type} • {m.size}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages</h3>
            <ul className="list-disc list-inside text-gray-800">
              {SAMPLE.pages.map(p => (
                <li key={p._id}>{p.title} ({p.slug})</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="list-disc list-inside text-gray-800">
              {SAMPLE.policies.map(p => (
                <li key={p._id}>{p.title}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Theme & Fonts</h3>
            <p className="text-gray-600 text-sm">Primary: Blue • Font: Inter/Poppins (preview)</p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">Sample Heading — Uddaan Agencies</div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Users & Roles</h3>
            <div className="space-y-3">
              {SAMPLE.users.map(u => (
                <div key={u._id} className="p-4 bg-white rounded-lg border border-gray-100 flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{u.email}</div>
                    <div className="text-xs text-gray-500">Roles: {u.roles.join(', ')}</div>
                  </div>
                  <div className={`text-xs ${u.mfa_enabled ? 'text-green-600' : 'text-gray-500'}`}>MFA {u.mfa_enabled ? 'Enabled' : 'Not Enabled'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-blue-50/10 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h3>
            <div className="space-y-3">
              {SAMPLE.audit.map(a => (
                <div key={a._id} className="p-3 bg-white rounded-lg border border-gray-100 text-sm text-gray-800">
                  <span className="font-semibold">{a.action}</span> on <span className="font-mono">{a.model}/{a.model_id}</span> • {new Date(a.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout activeTab={activeTab} onChangeTab={setActiveTab}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading secure dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onSecurityClick={() => setShowPassword(true)}
      onLogout={handleLogout}
    >
      {content}
    </AdminLayout>
  );
};

export default AdminDashboard; 