
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import {
  Users, Briefcase, Calendar, Star, FileText, Settings, Shield, Activity,
  Upload, Download, Eye, EyeOff, Edit, Trash2, Plus, Search, Filter,
  RefreshCw, Bell, AlertTriangle, CheckCircle, Clock, UserPlus,
  Database, Palette, Globe, Lock, Key, LogOut, Menu, X, ChevronDown,
  Home, Layers, Image, UserCheck, Mail, Phone, MapPin, Save, Camera,
  Zap, TrendingUp, BarChart3, PieChart as PieChartIcon, Target
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    jobs: [],
    applications: [],
    testimonials: [],
    events: [],
    consultations: [],
    users: [],
    roles: [],
    pages: [],
    media: [],
    auditLogs: [],
    themes: [],
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    checkAuth();
    fetchData();
    fetchNotifications();
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

      let url = `/api/admin/${activeTab}`;
      if (activeTab === 'dashboard') {
        url = '/api/admin/dashboard';
      }

      const params = new URLSearchParams();
      if (pagination.current > 1) params.append('page', pagination.current);
      if (searchTerm) params.append('search', searchTerm);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, { headers });
      const result = await response.json();

      if (result.success) {
        if (activeTab === 'dashboard') {
          setData(prev => ({ ...prev, ...result }));
        } else {
          setData(prev => ({ 
            ...prev, 
            [activeTab]: result[activeTab] || result.data || [],
            pagination: result.pagination || { current: 1, total: 1 }
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    // Mock notifications - replace with real API
    setNotifications([
      { id: 1, type: 'info', message: 'New application received', timestamp: new Date() },
      { id: 2, type: 'warning', message: 'Server load high', timestamp: new Date() },
      { id: 3, type: 'success', message: 'Backup completed', timestamp: new Date() }
    ]);
  };

  const handleCreate = async (itemData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      Object.entries(itemData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formDataToSend.append(key, value.join(','));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      if (selectedFile) {
        if (Array.isArray(selectedFile)) {
          selectedFile.forEach(file => formDataToSend.append('files', file));
        } else {
          formDataToSend.append('file', selectedFile);
        }
      }

      const response = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setFormData({});
        setSelectedFile(null);
        fetchData();
        showNotification('success', `${activeTab.slice(0, -1)} created successfully`);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', 'Error creating item');
    }
  };

  const handleUpdate = async (id, itemData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      Object.entries(itemData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formDataToSend.append(key, value.join(','));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        setSelectedFile(null);
        fetchData();
        showNotification('success', `${activeTab.slice(0, -1)} updated successfully`);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', 'Error updating item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
        showNotification('success', `${activeTab.slice(0, -1)} deleted successfully`);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', 'Error deleting item');
    }
  };

  const showNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/secure-admin-access-2024');
  };

  const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className="text-sm font-medium text-green-600">{trend}</span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );

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
          title="Consultations"
          value={data.stats?.consultations?.total || 0}
          subtitle={`${data.stats?.consultations?.pending || 0} pending`}
          icon={<Calendar className="w-8 h-8" />}
          trend={"+15%"}
          color="purple"
        />
        <StatCard
          title="Active Users"
          value={data.stats?.users?.total || 0}
          subtitle="System users"
          icon={<UserCheck className="w-8 h-8" />}
          trend={"+3%"}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyStats?.jobs || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'New', value: data.stats?.applications?.new || 0 },
                  { name: 'Processing', value: 25 },
                  { name: 'Approved', value: 35 },
                  { name: 'Rejected', value: 10 }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {data.recentApplications?.slice(0, 5).map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.name}</p>
                  <p className="text-sm text-gray-600">{app.jobId?.title}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity</h3>
          <div className="space-y-4">
            {data.recentAuditLogs?.slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  log.action === 'create' ? 'bg-green-100 text-green-600' :
                  log.action === 'update' ? 'bg-blue-100 text-blue-600' :
                  log.action === 'delete' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {log.userId?.name || 'System'} {log.action}d {log.model}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTable = (items, columns, entityName) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{entityName}</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${entityName.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setModalType('create');
                setShowModal(true);
                setFormData({});
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items?.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData(item);
                        setModalType('edit');
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900"
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
      {pagination?.total > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {pagination.current} of {pagination.total}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
              disabled={pagination.current === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={pagination.current === pagination.total}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      
      case 'users':
        return renderDataTable(
          data.users,
          [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { 
              key: 'role', 
              label: 'Role',
              render: (item) => item.roleId?.name || 'N/A'
            },
            { 
              key: 'isActive', 
              label: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              )
            },
            { 
              key: 'createdAt', 
              label: 'Created',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            }
          ],
          'Users'
        );

      case 'jobs':
        return renderDataTable(
          data.jobs,
          [
            { key: 'title', label: 'Title' },
            { key: 'company', label: 'Company' },
            { key: 'country', label: 'Country' },
            { key: 'jobType', label: 'Type' },
            { 
              key: 'isActive', 
              label: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              )
            },
            { key: 'applications', label: 'Applications' },
            { key: 'views', label: 'Views' }
          ],
          'Jobs'
        );

      case 'applications':
        return renderDataTable(
          data.applications,
          [
            { key: 'name', label: 'Candidate' },
            { key: 'email', label: 'Email' },
            { 
              key: 'jobId', 
              label: 'Job',
              render: (item) => item.jobId?.title || 'N/A'
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              )
            },
            { 
              key: 'createdAt', 
              label: 'Applied',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            }
          ],
          'Applications'
        );

      case 'consultations':
        return renderDataTable(
          data.consultations,
          [
            { key: 'bookingId', label: 'Booking ID' },
            { key: 'clientName', label: 'Client' },
            { key: 'clientEmail', label: 'Email' },
            { key: 'consultationType', label: 'Type' },
            { 
              key: 'preferredDate', 
              label: 'Date',
              render: (item) => new Date(item.preferredDate).toLocaleDateString()
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              )
            }
          ],
          'Consultations'
        );

      case 'audit':
        return renderDataTable(
          data.auditLogs,
          [
            { 
              key: 'userId', 
              label: 'User',
              render: (item) => item.userId?.name || 'System'
            },
            { key: 'action', label: 'Action' },
            { key: 'model', label: 'Model' },
            { key: 'ipAddress', label: 'IP Address' },
            { 
              key: 'severity', 
              label: 'Severity',
              render: (item) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.severity === 'low' ? 'bg-green-100 text-green-800' :
                  item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.severity}
                </span>
              )
            },
            { 
              key: 'createdAt', 
              label: 'Time',
              render: (item) => new Date(item.createdAt).toLocaleString()
            }
          ],
          'Audit Logs'
        );

      default:
        return renderDataTable(data[activeTab] || [], [], activeTab);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'pages', label: 'Pages', icon: Layers },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-600">Manage your {activeTab} efficiently</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchData}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Notifications Dropdown */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    notification.type === 'error' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     notification.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                     notification.type === 'error' ? <X className="w-4 h-4 text-red-600" /> :
                     <Bell className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
