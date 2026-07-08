// src/pages/ClientProposalsPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBriefcase, 
  FaUser, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaSearch,
  FaDollarSign,
  FaEnvelope,
  FaStar,
  FaArrowLeft,
  FaExclamationTriangle,
  FaSpinner,
  FaFilter,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaAward,
  FaMedal,
  FaPhone,
  FaGlobe,
  FaCode,
  FaRocket,
  FaHandshake,
  FaUserCircle,
  FaCheckDouble,
  FaHourglassHalf,
  FaFileAlt,
  FaPaperPlane
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const ClientProposalsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    avgBudget: 0
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      if (user) {
        fetchJobsWithProposals();
      } else {
        setLoading(false);
        setError('Please login to view proposals');
      }
    }
  }, [authLoading, user]);

  const fetchJobsWithProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = user?.id || user?._id;
      
      if (!userId) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await api.get(`/jobs/client/${userId}`);
      
      const jobsWithProposals = response.data.jobs.filter(job => 
        job.proposals && job.proposals.length > 0
      );
      
      setJobs(jobsWithProposals);
      
      if (jobsWithProposals.length > 0) {
        setSelectedJob(jobsWithProposals[0]);
        setProposals(jobsWithProposals[0].proposals);
        calculateStats(jobsWithProposals[0].proposals);
      } else {
        setProposals([]);
        setStats({ total: 0, pending: 0, accepted: 0, rejected: 0, avgBudget: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setError('Failed to load proposals');
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (proposalsList) => {
    const total = proposalsList.length;
    const pending = proposalsList.filter(p => p.status === 'pending').length;
    const accepted = proposalsList.filter(p => p.status === 'accepted').length;
    const rejected = proposalsList.filter(p => p.status === 'rejected').length;
    const totalBudget = proposalsList.reduce((sum, p) => sum + (p.proposedBudget || 0), 0);
    const avgBudget = total > 0 ? totalBudget / total : 0;

    setStats({
      total,
      pending,
      accepted,
      rejected,
      avgBudget
    });
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setProposals(job.proposals);
    setFilter('all');
    setSearchTerm('');
    calculateStats(job.proposals);
  };

  const handleProposalAction = async (proposalId, action) => {
    setProcessingId(proposalId);
    try {
      await api.put(`/proposals/${proposalId}/status`, { status: action });
      toast.success(`Proposal ${action} successfully!`);
      
      await fetchJobsWithProposals();
      
      if (selectedJob) {
        const updatedJob = jobs.find(j => j._id === selectedJob._id);
        if (updatedJob) {
          setSelectedJob(updatedJob);
          setProposals(updatedJob.proposals);
          calculateStats(updatedJob.proposals);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update proposal');
    } finally {
      setProcessingId(null);
    }
  };

  const openProposalDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };

  const closeProposalDetails = () => {
    setShowDetailsModal(false);
    setSelectedProposal(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf className="w-4 h-4" />;
      case 'accepted': return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'accepted': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.freelancer?.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.freelancer?.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || proposal.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-3 h-3 ${
              i < fullStars ? 'text-yellow-400 fill-yellow-400' :
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-yellow-400 opacity-50' :
              'text-zinc-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </Container>
    );
  }

  // Main Loading State
  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading proposals...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Unable to Load Proposals</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Button onClick={fetchJobsWithProposals} variant="secondary">
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  if (jobs.length === 0) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <FaEnvelope className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Proposals Yet</h3>
          <p className="text-zinc-400 mb-4">
            You haven't received any proposals yet. Post a job to get started!
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/create-job">
              <Button className="w-full">
                <FaBriefcase className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            </Link>
            <Link to="/my-jobs">
              <Button variant="secondary" className="w-full">
                <FaList className="w-4 h-4 mr-2" />
                View My Jobs
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/my-jobs')}
            className="text-zinc-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Proposals Received</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Review and manage proposals from freelancers
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Proposals</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Pending Review</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.accepted}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Accepted</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">${stats.avgBudget.toFixed(0)}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Avg Budget</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Job List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Your Jobs</h3>
                <span className="text-xs text-zinc-500">{jobs.length} jobs</span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => handleJobSelect(job)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition ${
                      selectedJob?._id === job._id
                        ? 'bg-violet-500/20 border border-violet-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <p className="font-medium truncate">{job.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-zinc-400">
                        {job.proposals.length} proposal(s)
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Proposals List */}
          <div className="lg:col-span-3">
            {selectedJob && (
              <>
                {/* Job Header */}
                <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border-violet-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <p className="text-sm text-zinc-400">
                          {selectedJob.proposals.length} proposals received
                        </p>
                        <span className="text-xs text-zinc-500">•</span>
                        <p className="text-sm text-zinc-400">
                          Budget: ${selectedJob.budget}
                        </p>
                        <span className="text-xs text-zinc-500">•</span>
                        <p className="text-sm text-zinc-400">
                          Posted: {formatDate(selectedJob.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Link to={`/jobs/${selectedJob._id}`}>
                      <Button size="sm" variant="secondary">
                        <FaEye className="w-4 h-4 mr-2" />
                        View Job
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by freelancer name, skills, or cover letter..."
                      icon={<FaSearch className="w-4 h-4" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {(searchTerm || filter !== 'all') && (
                      <Button variant="ghost" onClick={clearFilters}>
                        <FaTimes className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Proposals List */}
                {filteredProposals.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FaUser className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No proposals match your filters</p>
                    <button
                      onClick={clearFilters}
                      className="text-violet-400 hover:text-violet-300 text-sm mt-2"
                    >
                      Clear filters
                    </button>
                  </Card>
                ) : (
                  <AnimatePresence>
                    <div className="space-y-4">
                      {filteredProposals.map((proposal) => (
                        <motion.div
                          key={proposal._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <Card className="p-4 sm:p-6 hover:border-white/20 transition">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                              {/* Freelancer Info */}
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-white">
                                      {proposal.freelancer?.name?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="font-semibold">{proposal.freelancer?.name || 'Unknown'}</h4>
                                      <span className="text-xs text-zinc-400">
                                        {proposal.freelancer?.headline || 'Freelancer'}
                                      </span>
                                      {proposal.freelancer?.rating > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                                          {renderStars(proposal.freelancer.rating)}
                                          <span className="ml-1">{proposal.freelancer.rating}</span>
                                        </span>
                                      )}
                                      {proposal.freelancer?.isVerified && (
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                          <FaCheckCircle className="w-3 h-3" />
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-zinc-400">
                                      <span className="flex items-center gap-1">
                                        <FaDollarSign className="w-3 h-3" />
                                        Proposed: ${proposal.proposedBudget}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <FaClock className="w-3 h-3" />
                                        {proposal.estimatedDuration}
                                      </span>
                                      {proposal.freelancer?.hourlyRate && (
                                        <span className="flex items-center gap-1">
                                          <FaClock className="w-3 h-3" />
                                          ${proposal.freelancer.hourlyRate}/hr
                                        </span>
                                      )}
                                    </div>

                                    {proposal.freelancer?.skills && proposal.freelancer.skills.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {proposal.freelancer.skills.slice(0, 4).map((skill) => (
                                          <span
                                            key={skill}
                                            className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-zinc-300"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                        {proposal.freelancer.skills.length > 4 && (
                                          <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-zinc-500">
                                            +{proposal.freelancer.skills.length - 4} more
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    <div className="mt-2 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition" onClick={() => openProposalDetails(proposal)}>
                                      <p className="text-sm text-zinc-300 line-clamp-2 flex items-start gap-2">
                                        <FaFileAlt className="w-3 h-3 text-zinc-500 mt-0.5 flex-shrink-0" />
                                        {proposal.coverLetter}
                                      </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500">
                                      <span className="flex items-center gap-1">
                                        <FaCalendarAlt className="w-3 h-3" />
                                        Applied: {formatDate(proposal.createdAt)}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
                                        {getStatusIcon(proposal.status)}
                                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                                {proposal.status === 'pending' && (
                                  <>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleProposalAction(proposal._id, 'accepted')}
                                        loading={processingId === proposal._id}
                                        disabled={processingId === proposal._id}
                                      >
                                        <FaCheckCircle className="w-4 h-4 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleProposalAction(proposal._id, 'rejected')}
                                        loading={processingId === proposal._id}
                                        disabled={processingId === proposal._id}
                                      >
                                        <FaTimesCircle className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => openProposalDetails(proposal)}
                                      className="mt-1 sm:mt-0"
                                    >
                                      <FaEye className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}

                                {proposal.status === 'accepted' && (
                                  <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <FaCheckDouble className="w-5 h-5" />
                                    <span>Accepted</span>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => openProposalDetails(proposal)}
                                    >
                                      <FaEye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}

                                {proposal.status === 'rejected' && (
                                  <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <FaTimesCircle className="w-5 h-5" />
                                    <span>Rejected</span>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => openProposalDetails(proposal)}
                                    >
                                      <FaEye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </>
            )}
          </div>
        </div>

        {/* Proposal Details Modal */}
        {showDetailsModal && selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#09090B] rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Proposal Details</h3>
                <button
                  onClick={closeProposalDetails}
                  className="p-1 hover:bg-white/5 rounded-lg transition"
                >
                  <FaTimes className="w-5 h-5 text-zinc-400 hover:text-white" />
                </button>
              </div>

              {/* Freelancer Profile */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {selectedProposal.freelancer?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold">{selectedProposal.freelancer?.name || 'Unknown'}</h4>
                    {selectedProposal.freelancer?.isVerified && (
                      <FaCheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">{selectedProposal.freelancer?.headline || 'Freelancer'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {renderStars(selectedProposal.freelancer?.rating || 0)}
                    <span className="text-sm text-zinc-400">({selectedProposal.freelancer?.rating || 0})</span>
                  </div>
                </div>
                <Link to={`/freelancers/${selectedProposal.freelancer?._id}`}>
                  <Button size="sm" variant="secondary">
                    <FaUser className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </Link>
              </div>

              {/* Proposal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-zinc-400">Proposed Budget</p>
                  <p className="text-lg font-bold text-green-400">${selectedProposal.proposedBudget}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-zinc-400">Estimated Duration</p>
                  <p className="text-lg font-bold text-white">{selectedProposal.estimatedDuration}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-zinc-400">Status</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedProposal.status)}`}>
                    {getStatusIcon(selectedProposal.status)}
                    {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-zinc-400">Applied Date</p>
                  <p className="text-lg font-bold text-white">{formatDate(selectedProposal.createdAt)}</p>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <p className="text-xs text-zinc-400 mb-2">Cover Letter</p>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{selectedProposal.coverLetter}</p>
                </div>
              </div>

              {/* Skills */}
              {selectedProposal.freelancer?.skills && selectedProposal.freelancer.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-zinc-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProposal.freelancer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm"
                      >
                        <FaCode className="inline w-3 h-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedProposal.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleProposalAction(selectedProposal._id, 'accepted');
                      closeProposalDetails();
                    }}
                    loading={processingId === selectedProposal._id}
                    disabled={processingId === selectedProposal._id}
                  >
                    <FaCheckCircle className="w-4 h-4 mr-2" />
                    Accept Proposal
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      handleProposalAction(selectedProposal._id, 'rejected');
                      closeProposalDetails();
                    }}
                    loading={processingId === selectedProposal._id}
                    disabled={processingId === selectedProposal._id}
                  >
                    <FaTimesCircle className="w-4 h-4 mr-2" />
                    Reject Proposal
                  </Button>
                </div>
              )}

              {selectedProposal.status === 'accepted' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <div className="flex-1 text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-green-400 font-medium">✅ This proposal has been accepted</p>
                    <p className="text-sm text-zinc-400">The freelancer has been notified</p>
                  </div>
                </div>
              )}

              {selectedProposal.status === 'rejected' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <div className="flex-1 text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-red-400 font-medium">❌ This proposal has been rejected</p>
                    <p className="text-sm text-zinc-400">The freelancer has been notified</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ClientProposalsPage;