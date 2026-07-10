// src/pages/AdminDashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaBriefcase, 
  FaDollarSign, 
  FaChartLine,
  FaUserPlus,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaCrown,
  FaRocket,
  FaStar,
  FaCreditCard,
  FaWallet,
  FaUserCog,
  FaShieldAlt,
  FaBan,
  FaCheck,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';
import Modal from '../components/ui/Modal/Modal';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalJobs: 0,
    openJobs: 0,
    totalProposals: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeSubscriptions: 0,
    platformFees: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    isVerified: false,
    isActive: true
  });

  // Subscription form state
  const [subscriptionForm, setSubscriptionForm] = useState({
    plan: 'professional',
    status: 'active',
    autoRenew: true
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes, paymentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/jobs'),
        api.get('/admin/payments')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setJobs(jobsRes.data.jobs || []);
      setPayments(paymentsRes.data.payments || []);
      setSubscriptions(usersRes.data.users.filter(u => u.subscription?.status === 'active'));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}`, editForm);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubscriptionAction = async (action) => {
    if (!selectedUser) return;
    
    setProcessing(true);
    try {
      if (action === 'add' || action === 'update') {
        await api.put(`/admin/users/${selectedUser._id}/subscription`, subscriptionForm);
        toast.success(`Subscription ${action === 'add' ? 'added' : 'updated'} successfully`);
      } else if (action === 'remove') {
        await api.delete(`/admin/users/${selectedUser._id}/subscription`);
        toast.success('Subscription removed successfully');
      }
      setShowSubscriptionModal(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to manage subscription');
    } finally {
      setProcessing(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'freelancer',
      isVerified: user.isVerified || false,
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setShowEditModal(true);
  };

  const openSubscriptionModal = (user) => {
    setSelectedUser(user);
    setSubscriptionForm({
      plan: user.subscription?.plan || 'professional',
      status: user.subscription?.status || 'active',
      autoRenew: user.subscription?.autoRenew !== undefined ? user.subscription.autoRenew : true
    });
    setShowSubscriptionModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Manage users, jobs, payments, and subscriptions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={fetchAllData}>
              <FaDownload className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 text-center">
            <FaUsers className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Users</p>
            <div className="flex justify-center gap-2 mt-1 text-xs text-zinc-500">
              <span>👤 {stats.totalFreelancers}</span>
              <span>🏢 {stats.totalClients}</span>
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <FaBriefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalJobs}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Jobs</p>
            <div className="text-xs text-green-400 mt-1">
              {stats.openJobs} Open
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <FaDollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Revenue</p>
            <div className="text-xs text-yellow-400 mt-1">
              💰 {formatCurrency(stats.platformFees)} Fees
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <FaCrown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.activeSubscriptions}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Active Subscriptions</p>
            <div className="text-xs text-zinc-500 mt-1">
              💳 {stats.pendingPayments} Pending
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'users', 'jobs', 'payments', 'subscriptions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Users</h3>
                <button onClick={() => setActiveTab('users')} className="text-xs text-violet-400 hover:text-violet-300">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'freelancer' 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Jobs */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Jobs</h3>
                <button onClick={() => setActiveTab('jobs')} className="text-xs text-violet-400 hover:text-violet-300">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job._id} className="p-2 hover:bg-white/5 rounded-lg transition">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        job.status === 'open' ? 'bg-green-500/20 text-green-400' :
                        job.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                      <span>💰 ${job.budget}</span>
                      <span>👤 {job.client?.name}</span>
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Payments */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Payments</h3>
                <button onClick={() => setActiveTab('payments')} className="text-xs text-violet-400 hover:text-violet-300">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400 border-b border-white/10">
                      <th className="pb-2">Invoice</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Freelancer</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 5).map((payment) => (
                      <tr key={payment._id} className="border-b border-white/5">
                        <td className="py-2 text-xs">{payment.invoiceNumber}</td>
                        <td className="py-2 font-medium">{formatCurrency(payment.amount)}</td>
                        <td className="py-2 text-xs truncate max-w-[80px]">{payment.client?.name}</td>
                        <td className="py-2 text-xs truncate max-w-[80px]">{payment.freelancer?.name}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            payment.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-2 text-xs">{formatDate(payment.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name, email, or role..."
                  icon={<FaSearch className="w-4 h-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" className="flex-shrink-0">
                <FaFilter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-400 border-b border-white/10">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Verified</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs">{user.email}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === 'freelancer' 
                            ? 'bg-violet-500/20 text-violet-400' 
                            : user.role === 'client'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        {user.subscription?.plan && user.subscription.plan !== 'free' ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.subscription.plan === 'professional' ? 'bg-violet-500/20 text-violet-400' :
                            user.subscription.plan === 'enterprise' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.subscription.plan}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500">Free</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3">
                        {user.isVerified ? (
                          <FaCheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4 text-zinc-500" />
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1 hover:bg-white/5 rounded transition"
                            title="Edit User"
                          >
                            <FaEdit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => openSubscriptionModal(user)}
                            className="p-1 hover:bg-white/5 rounded transition"
                            title="Manage Subscription"
                          >
                            <FaCrown className="w-4 h-4 text-yellow-400" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 hover:bg-white/5 rounded transition"
                            title="Delete User"
                          >
                            <FaTrash className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search jobs..."
                  icon={<FaSearch className="w-4 h-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" className="flex-shrink-0">
                <FaFilter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-400 border-b border-white/10">
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Client</th>
                    <th className="pb-2">Budget</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Proposals</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3 text-xs">{job.client?.name}</td>
                      <td className="py-3 font-medium">${job.budget}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          job.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          job.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">{job.proposals?.length || 0}</td>
                      <td className="py-3 text-xs">{formatDate(job.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Link to={`/jobs/${job._id}`}>
                            <button className="p-1 hover:bg-white/5 rounded transition" title="View">
                              <FaEye className="w-4 h-4 text-blue-400" />
                            </button>
                          </Link>
                          <button className="p-1 hover:bg-white/5 rounded transition" title="Delete">
                            <FaTrash className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Active Subscriptions</h3>
                <div className="flex gap-2 text-sm text-zinc-400">
                  <span>Total: {subscriptions.length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400 border-b border-white/10">
                      <th className="pb-2">User</th>
                      <th className="pb-2">Plan</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Started</th>
                      <th className="pb-2">Ends</th>
                      <th className="pb-2">Auto Renew</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.subscription?.plan === 'professional' ? 'bg-violet-500/20 text-violet-400' :
                            user.subscription?.plan === 'enterprise' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.subscription?.plan}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.subscription?.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {user.subscription?.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs">{formatDate(user.subscription?.startDate)}</td>
                        <td className="py-3 text-xs">{formatDate(user.subscription?.endDate)}</td>
                        <td className="py-3">
                          {user.subscription?.autoRenew ? (
                            <FaCheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <FaTimesCircle className="w-4 h-4 text-zinc-500" />
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => openSubscriptionModal(user)}
                            className="p-1 hover:bg-white/5 rounded transition"
                            title="Manage Subscription"
                          >
                            <FaEdit className="w-4 h-4 text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Edit User Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              disabled
            />
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Role</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isVerified}
                  onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  className="rounded border-white/10 bg-white/5"
                />
                <span className="text-sm text-zinc-300">Verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="rounded border-white/10 bg-white/5"
                />
                <span className="text-sm text-zinc-300">Active</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditUser}
                loading={processing}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* Subscription Modal */}
        <Modal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          title={`Manage Subscription - ${selectedUser?.name || ''}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Plan</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={subscriptionForm.plan}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, plan: e.target.value })}
              >
                <option value="free">Free</option>
                <option value="starter">Starter ($29/mo)</option>
                <option value="professional">Professional ($79/mo)</option>
                <option value="enterprise">Enterprise ($199/mo)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Status</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={subscriptionForm.status}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subscriptionForm.autoRenew}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, autoRenew: e.target.checked })}
                className="rounded border-white/10 bg-white/5"
              />
              <span className="text-sm text-zinc-300">Auto Renew</span>
            </label>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              {selectedUser?.subscription?.plan && selectedUser.subscription.plan !== 'free' ? (
                <>
                  <Button
                    variant="danger"
                    onClick={() => handleSubscriptionAction('remove')}
                    loading={processing}
                    className="flex-1"
                  >
                    Remove Subscription
                  </Button>
                  <Button
                    onClick={() => handleSubscriptionAction('update')}
                    loading={processing}
                    className="flex-1"
                  >
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleSubscriptionAction('add')}
                  loading={processing}
                  className="flex-1"
                >
                  Add Subscription
                </Button>
              )}
            </div>
          </div>
        </Modal>

        {/* Delete User Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete User"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-zinc-400">
              Are you sure you want to delete user <span className="text-white font-semibold">{selectedUser?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteUser}
                loading={processing}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </Container>
    </section>
  );
};

export default AdminDashboardPage;