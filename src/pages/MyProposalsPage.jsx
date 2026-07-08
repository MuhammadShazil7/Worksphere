// src/pages/MyProposalsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaEye,
  FaDollarSign,
  FaBriefcase,
  FaUser,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const MyProposalsPage = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/proposals/my-proposals');
      setProposals(response.data.proposals || []);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      
      if (error.response?.status === 401) {
        setError('Please login to view your proposals');
      } else {
        setError('Failed to load your proposals');
        toast.error('Failed to load your proposals');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedProposal) return;
    
    setWithdrawing(true);
    try {
      await api.put(`/proposals/${selectedProposal}/withdraw`);
      toast.success('Proposal withdrawn successfully');
      setShowWithdrawModal(false);
      setSelectedProposal(null);
      fetchProposals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw proposal');
    } finally {
      setWithdrawing(false);
    }
  };

  const openWithdrawModal = (proposalId) => {
    setSelectedProposal(proposalId);
    setShowWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setSelectedProposal(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'accepted': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'withdrawn': return 'text-zinc-400 bg-zinc-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'accepted': return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FaTimesCircle className="w-4 h-4" />;
      case 'withdrawn': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Under Review';
      case 'accepted': return 'Accepted 🎉';
      case 'rejected': return 'Declined';
      case 'withdrawn': return 'Withdrawn';
      default: return status;
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.job?.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || proposal.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading your proposals...</p>
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
          <Button onClick={fetchProposals} variant="secondary">
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Proposals</h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            {user?.role === 'client' 
              ? 'Review proposals from freelancers' 
              : 'Track all your job applications'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Proposals</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Pending</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.accepted}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Accepted</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Rejected</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by job title, client, or cover letter..."
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
              <option value="withdrawn">Withdrawn</option>
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
          <div className="text-center py-16 sm:py-20">
            <FaPaperPlane className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">
              {searchTerm || filter !== 'all' ? 'No proposals match your filters' : 'No proposals found'}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {user?.role === 'freelancer' 
                ? 'Start applying to jobs to see your proposals here'
                : 'Post a job to receive proposals from freelancers'}
            </p>
            {user?.role === 'freelancer' ? (
              <Link to="/jobs" className="text-violet-400 hover:text-violet-300 transition mt-4 inline-block">
                Browse Jobs →
              </Link>
            ) : (
              <Link to="/create-job" className="text-violet-400 hover:text-violet-300 transition mt-4 inline-block">
                Post a Job →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 sm:p-6 hover:border-white/20 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/5 rounded-xl flex-shrink-0">
                          <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link to={`/jobs/${proposal.job._id}`}>
                            <h3 className="text-base sm:text-lg font-semibold hover:text-violet-400 transition truncate">
                              {proposal.job.title}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                              {user?.role === 'client' 
                                ? proposal.freelancer?.name || 'Unknown'
                                : proposal.job.client?.name || 'Anonymous'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                              ${proposal.proposedBudget}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {proposal.estimatedDuration}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
                              {getStatusIcon(proposal.status)}
                              {getStatusLabel(proposal.status)}
                            </span>
                          </div>
                          <div className="mt-2 p-2 sm:p-3 bg-white/5 rounded-xl">
                            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">
                              {proposal.coverLetter}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 self-start lg:self-center">
                      <Link to={`/jobs/${proposal.job._id}`}>
                        <Button size="sm" variant="secondary" className="text-xs sm:text-sm">
                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">View Job</span>
                        </Button>
                      </Link>
                      {proposal.status === 'pending' && user?.role === 'freelancer' && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => openWithdrawModal(proposal._id)}
                          className="text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Withdraw</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Withdraw Confirmation Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#09090B] rounded-2xl border border-white/10 p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2">Withdraw Proposal</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to withdraw this proposal? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={closeWithdrawModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleWithdraw}
                  loading={withdrawing}
                  className="flex-1"
                >
                  Withdraw
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default MyProposalsPage;