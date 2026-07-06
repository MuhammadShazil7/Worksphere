// src/components/landing/Dashboard/FreelancerDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaStar, 
  FaBriefcase, 
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserPlus,
  FaMoneyBillWave,
  FaSpinner,
  FaPlus
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../../services/api';
import Container from '../../ui/Container/Container';
import Card from '../../ui/Card/card';
import Button from '../../ui/Button/Button';

const FreelancerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    earnings: 0,
    rating: 0,
    skills: [],
    recentProjects: [],
    pendingInvites: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch user data with stats
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      
      // Fetch proposals and projects
      const proposalsRes = await api.get('/proposals/my-proposals');
      const proposals = proposalsRes.data.proposals || [];
      
      // Calculate stats
      const totalProjects = userData.totalProjects || 0;
      const completedProjects = userData.completedProjects || 0;
      const earnings = userData.earnings || 0;
      const rating = userData.rating || 0;
      const skills = userData.skills || [];
      
      // Get recent projects (last 4 proposals with jobs)
      const recentProjects = proposals
        .filter(p => p.job)
        .slice(0, 4)
        .map(p => ({
          title: p.job.title || 'Unknown Project',
          client: p.job.client?.name || 'Client',
          status: p.status || 'Pending',
          icon: p.status === 'completed' ? FaCheckCircle : 
                p.status === 'in-progress' ? FaClock : 
                FaBriefcase,
          statusColor: p.status === 'completed' ? 'text-green-400' :
                       p.status === 'accepted' ? 'text-blue-400' :
                       p.status === 'pending' ? 'text-yellow-400' :
                       'text-red-400',
          bgColor: p.status === 'completed' ? 'bg-green-400/10' :
                   p.status === 'accepted' ? 'bg-blue-400/10' :
                   p.status === 'pending' ? 'bg-yellow-400/10' :
                   'bg-red-400/10'
        }));
      
      // Get pending invites (proposals with status 'pending' and not withdrawn)
      const pendingInvites = proposals
        .filter(p => p.status === 'pending' && p.job)
        .slice(0, 5)
        .map(p => ({
          title: p.job?.title || 'Unknown Project',
          company: p.job?.client?.name || 'Client',
          budget: `$${p.proposedBudget || p.job?.budget || 0}`,
          proposalId: p._id,
          jobId: p.job?._id
        }));
      
      setStats({
        totalProjects,
        completedProjects,
        earnings,
        rating,
        skills,
        recentProjects: recentProjects.length > 0 ? recentProjects : [
          { title: 'No projects yet', client: 'Start applying!', status: 'N/A', icon: FaBriefcase, statusColor: 'text-zinc-400', bgColor: 'bg-white/5' }
        ],
        pendingInvites: pendingInvites.length > 0 ? pendingInvites : [],
        loading: false
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAcceptInvite = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/status`, { status: 'accepted' });
      toast.success('Invite accepted! 🎉');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to accept invite');
    }
  };

  const handleDeclineInvite = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/status`, { status: 'rejected' });
      toast.success('Invite declined');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to decline invite');
    }
  };

  const metrics = [
    { 
      label: 'Total Projects', 
      value: stats.totalProjects, 
      change: '+12%', 
      icon: FaBriefcase,
      color: 'text-blue-400'
    },
    { 
      label: 'Completed', 
      value: stats.completedProjects, 
      change: '+8%', 
      icon: FaCheckCircle,
      color: 'text-green-400'
    },
    { 
      label: 'Earnings', 
      value: `$${stats.earnings.toLocaleString()}`, 
      change: '+18.6%', 
      icon: FaMoneyBillWave,
      color: 'text-yellow-400'
    },
    { 
      label: 'Rating', 
      value: stats.rating.toFixed(1), 
      change: '+0.3', 
      icon: FaStar,
      color: 'text-yellow-400'
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base">
          Here's what's happening with your freelancing journey.
        </p>
      </motion.div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="col-span-1"
          >
            <Card className="p-4 sm:p-6 text-center">
              <metric.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${metric.color} mx-auto mb-1 sm:mb-2`} />
              <div className="text-xl sm:text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-xs sm:text-sm text-zinc-400">{metric.label}</div>
              <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} mt-1`}>
                {metric.change}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects & Pending Invites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {stats.recentProjects.map((project, index) => (
              <Card key={index} className="p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-xl ${project.bgColor}`}>
                    <project.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${project.statusColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base truncate">{project.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 truncate">{project.client}</p>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs ${project.statusColor} ${project.bgColor} whitespace-nowrap`}>
                    {project.status}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Link to="/my-proposals" className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition inline-block">
            View all projects →
          </Link>
        </div>

        {/* Pending Invites */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Pending Invites</h3>
          {stats.pendingInvites.length > 0 ? (
            <div className="space-y-3">
              {stats.pendingInvites.map((invite, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{invite.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-400 truncate">{invite.company}</p>
                      <p className="text-xs sm:text-sm text-violet-400">{invite.budget}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleAcceptInvite(invite.proposalId)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-green-600 rounded-lg hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDeclineInvite(invite.proposalId)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-zinc-400">
              <p className="text-sm sm:text-base">No pending invites</p>
              <Link to="/jobs" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
                Browse jobs →
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Skills</h3>
        {stats.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stats.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-full text-xs sm:text-sm text-zinc-300 border border-white/5"
              >
                {skill}
              </span>
            ))}
            <Link to="/profile/edit">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-violet-400 border border-violet-400/30 rounded-full hover:bg-violet-500/10 transition flex items-center gap-1">
                <FaPlus className="w-3 h-3" />
                Add Skill
              </button>
            </Link>
          </div>
        ) : (
          <Card className="p-6 text-center text-zinc-400">
            <p className="text-sm sm:text-base">No skills added yet</p>
            <Link to="/profile/edit" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
              Add your skills →
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;