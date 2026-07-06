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
  FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const MyProposalsPage = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected, withdrawn

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proposals/my-proposals');
      setProposals(response.data.proposals || []);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      toast.error('Failed to load your proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (proposalId) => {
    if (!window.confirm('Are you sure you want to withdraw this proposal?')) return;

    try {
      await api.put(`/proposals/${proposalId}/withdraw`);
      toast.success('Proposal withdrawn successfully');
      fetchProposals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw proposal');
    }
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

  const filteredProposals = proposals.filter(p => 
    filter === 'all' || p.status === filter
  );

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
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

  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Proposals</h1>
          <p className="text-zinc-400">Track all your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Proposals</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-sm text-zinc-400">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
            <p className="text-sm text-zinc-400">Accepted</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-sm text-zinc-400">Rejected</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'accepted', 'rejected', 'withdrawn'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === status
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/5 rounded-full">
                  {proposals.filter(p => p.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="text-center py-20">
            <FaPaperPlane className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No proposals found</p>
            <Link to="/jobs" className="text-violet-400 hover:text-violet-300 transition mt-2 inline-block">
              Browse Jobs → 
            </Link>
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
                <Card className="p-6 hover:border-white/20 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl">
                          <FaBriefcase className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <Link to={`/jobs/${proposal.job._id}`}>
                            <h3 className="text-lg font-semibold hover:text-violet-400 transition">
                              {proposal.job.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-zinc-400">
                            Client: {proposal.job.client?.name || 'Anonymous'}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-zinc-400">
                              <FaDollarSign className="w-4 h-4" />
                              ${proposal.proposedBudget}
                            </span>
                            <span className="flex items-center gap-1 text-zinc-400">
                              <FaClock className="w-4 h-4" />
                              {proposal.estimatedDuration}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(proposal.status)}`}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-zinc-400 line-clamp-2">
                              {proposal.coverLetter}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/jobs/${proposal.job._id}`}>
                        <Button size="sm" variant="secondary">
                          <FaEye className="w-4 h-4 mr-1" />
                          View Job
                        </Button>
                      </Link>
                      {proposal.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleWithdraw(proposal._id)}
                        >
                          Withdraw
                        </Button>
                      )}
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

export default MyProposalsPage;