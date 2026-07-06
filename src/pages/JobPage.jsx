// src/pages/JobPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const JobPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    experienceLevel: '',
    projectType: '',
    minBudget: '',
    maxBudget: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = !filters.category || job.category === filters.category;

    // Experience level filter
    const matchesExperience = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;

    // Project type filter
    const matchesProjectType = !filters.projectType || job.projectType === filters.projectType;

    // Budget filter
    const matchesMinBudget = !filters.minBudget || job.budget >= parseInt(filters.minBudget);
    const matchesMaxBudget = !filters.maxBudget || job.budget <= parseInt(filters.maxBudget);

    return matchesSearch && matchesCategory && matchesExperience && 
           matchesProjectType && matchesMinBudget && matchesMaxBudget;
  });

  const clearFilters = () => {
    setFilters({
      category: '',
      experienceLevel: '',
      projectType: '',
      minBudget: '',
      maxBudget: '',
    });
    setSearchTerm('');
  };

  const categories = ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Other'];
  const experienceLevels = ['Entry', 'Intermediate', 'Expert'];
  const projectTypes = ['Fixed Price', 'Hourly'];

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-400">Loading jobs...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Find Your Dream Job</h1>
              <p className="text-zinc-400">Discover opportunities from top companies</p>
            </div>
            {user?.role === 'client' && (
              <Link to="/create-job">
                <Button>
                  <FaBriefcase className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
          </div>
          <p className="text-sm text-zinc-500 mt-2">Found {filteredJobs.length} job(s)</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search jobs, companies, or skills..."
              icon={<FaSearch className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            icon={<FaFilter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {Object.values(filters).some(f => f) && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-violet-500 rounded-full">●</span>
            )}
          </Button>
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Experience Level</label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Project Type</label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    value={filters.projectType}
                    onChange={(e) => setFilters({ ...filters, projectType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Budget Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minBudget}
                      onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxBudget}
                      onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <FaBriefcase className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No jobs found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-violet-400 hover:text-violet-300 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/jobs/${job._id}`}>
                  <Card className="p-6 hover:border-white/20 transition cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl">
                          <FaBriefcase className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold hover:text-violet-400 transition">
                            {job.title}
                          </h3>
                          <p className="text-zinc-400">Client: {job.client?.name || 'Anonymous'}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="w-4 h-4" />
                              Remote
                            </span>
                            <span className="flex items-center gap-1">
                              <FaDollarSign className="w-4 h-4" />
                              ${job.budget || 'Negotiable'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-4 h-4" />
                              {job.duration || 'Flexible'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              {job.experienceLevel || 'Any'}
                            </span>
                          </div>
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {job.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-500">
                                  +{job.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          job.status === 'open' ? 'bg-green-500/10 text-green-400' :
                          job.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {job.status || 'Open'}
                        </span>
                        <Button size="sm" className="whitespace-nowrap">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default JobPage;