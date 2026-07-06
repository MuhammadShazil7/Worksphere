// src/pages/MyJobsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBriefcase, 
  FaUsers, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const MyJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, in-progress, completed

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/client/${user?.id}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
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

  const filteredJobs = jobs.filter(job => 
    filter === 'all' || job.status === filter
  );

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

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

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-zinc-400">Manage all your posted jobs</p>
          </div>
          <Link to="/create-job">
            <Button>
              <FaBriefcase className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Jobs</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.open}</p>
            <p className="text-sm text-zinc-400">Open</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
            <p className="text-sm text-zinc-400">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
            <p className="text-sm text-zinc-400">Completed</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'open', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === status
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/5 rounded-full">
                  {jobs.filter(j => j.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <FaBriefcase className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No jobs found</p>
            <Link to="/create-job" className="text-violet-400 hover:text-violet-300 transition mt-2 inline-block">
              Post your first job →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:border-white/20 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl">
                          <FaBriefcase className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <Link to={`/jobs/${job._id}`}>
                            <h3 className="text-lg font-semibold hover:text-violet-400 transition">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <FaDollarSign className="w-4 h-4" />
                              ${job.budget}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-4 h-4" />
                              {job.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="w-4 h-4" />
                              Remote
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(job.status)}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills?.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-500">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/jobs/${job._id}`}>
                        <Button size="sm" variant="secondary">
                          <FaEye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/edit-job/${job._id}`}>
                        <Button size="sm" variant="secondary">
                          <FaEdit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleDelete(job._id)}
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default MyJobsPage;