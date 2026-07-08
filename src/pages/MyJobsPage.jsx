// src/pages/MyJobsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBriefcase, 
  FaUsers, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChartLine,
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const MyJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get user ID from either `id` or `_id`
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchJobs();
    } else {
      setLoading(false);
      setError('Please login to view your jobs');
    }
  }, [userId]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jobs for client:', userId); // Debug log
      
      const response = await api.get(`/jobs/client/${userId}`);
      
      console.log('Jobs response:', response.data); // Debug log
      
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      console.error('Error details:', error.response?.data); // Debug log
      
      const errorMessage = error.response?.data?.message || 'Failed to load your jobs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    
    setDeleting(true);
    try {
      await api.delete(`/jobs/${selectedJob}`);
      toast.success('Job deleted successfully');
      setShowDeleteModal(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (jobId) => {
    setSelectedJob(jobId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedJob(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-400 bg-green-400/10';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaClock className="w-3 h-3" />;
      case 'in-progress': return <FaSpinner className="w-3 h-3 animate-spin" />;
      case 'completed': return <FaCheckCircle className="w-3 h-3" />;
      default: return <FaTimes className="w-3 h-3" />;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || job.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    totalBudget: jobs.reduce((sum, job) => sum + (job.budget || 0), 0),
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setShowFilters(false);
  };

  // Loading State
  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading your jobs...</p>
        </div>
      </Container>
    );
  }

  // Error State
  if (error) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Unable to Load Jobs</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Button onClick={fetchJobs} variant="secondary">
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Jobs</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Manage all your posted jobs
            </p>
          </div>
          <Link to="/create-job">
            <Button className="w-full sm:w-auto">
              <FaPlus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Jobs</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.open}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Open</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
            <p className="text-xs sm:text-sm text-zinc-400">In Progress</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats.completed}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Completed</p>
          </Card>
        </div>

        {/* Total Budget Card */}
        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border-violet-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm text-zinc-400">Total Budget Allocated</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">${stats.totalBudget.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <FaChartLine className="w-4 h-4 text-violet-400" />
              <span>Across {stats.total} job(s)</span>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search jobs by title, description, or skills..."
              icon={<FaSearch className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              icon={<FaFilter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              {showFilters ? 'Hide' : 'Filter'}
              {(searchTerm || filter !== 'all') && (
                <span className="ml-2 w-2 h-2 bg-violet-500 rounded-full inline-block" />
              )}
            </Button>
            {(searchTerm || filter !== 'all') && (
              <Button variant="ghost" onClick={clearFilters} className="flex-shrink-0">
                <FaTimes className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'open', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                filter === status
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {status === 'all' ? 'All Jobs' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs bg-white/5 rounded-full">
                  {jobs.filter(j => j.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-400">
            Showing <span className="text-white font-medium">{filteredJobs.length}</span> job(s)
          </p>
          {filteredJobs.length > 0 && (
            <p className="text-xs text-zinc-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <FaBriefcase className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">
              {searchTerm || filter !== 'all' ? 'No jobs match your filters' : 'No jobs found'}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Post your first job to get started'}
            </p>
            {(searchTerm || filter !== 'all') ? (
              <button
                onClick={clearFilters}
                className="mt-4 text-violet-400 hover:text-violet-300 transition inline-block"
              >
                Clear all filters
              </button>
            ) : (
              <Link to="/create-job" className="text-violet-400 hover:text-violet-300 transition mt-4 inline-block">
                Post your first job →
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 sm:p-6 hover:border-white/20 transition group">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-white/5 rounded-xl flex-shrink-0">
                            <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link to={`/jobs/${job._id}`}>
                              <h3 className="text-base sm:text-lg font-semibold hover:text-violet-400 transition truncate">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-zinc-400">
                              <span className="flex items-center gap-1">
                                <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                                ${job.budget?.toLocaleString() || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                                {job.duration || 'Flexible'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                                Remote
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(job.status)}`}>
                                {getStatusIcon(job.status)}
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </div>
                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                {job.skills.slice(0, 4).map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-zinc-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 4 && (
                                  <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-zinc-500">
                                    +{job.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                            {job.proposals && job.proposals.length > 0 && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                                <FaUsers className="w-3 h-3" />
                                <span>{job.proposals.length} proposal(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 self-start lg:self-center">
                        <Link to={`/jobs/${job._id}`}>
                          <Button size="sm" variant="secondary" className="text-xs sm:text-sm">
                            <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>
                        <Link to={`/edit-job/${job._id}`}>
                          <Button size="sm" variant="secondary" className="text-xs sm:text-sm">
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => openDeleteModal(job._id)}
                          className="text-xs sm:text-sm"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#09090B] rounded-2xl border border-white/10 p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2">Delete Job</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={closeDeleteModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleting}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default MyJobsPage;