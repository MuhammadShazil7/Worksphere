// src/components/landing/Dashboard/ClientDashboard.jsx
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaBriefcase, 
  FaUserPlus,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa';

import Container from '../../ui/Container/Container';
import Card from '../../ui/Card/card';

const ClientDashboard = ({ user }) => {
  const metrics = [
    { 
      label: 'Active Projects', 
      value: '12', 
      change: '+3', 
      icon: FaBriefcase,
      color: 'text-blue-400'
    },
    { 
      label: 'Freelancers Hired', 
      value: '8', 
      change: '+2', 
      icon: FaUsers,
      color: 'text-green-400'
    },
    { 
      label: 'Total Spent', 
      value: '$45,200', 
      change: '+22%', 
      icon: FaMoneyBillWave,
      color: 'text-yellow-400'
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      change: '+0.2', 
      icon: FaChartLine,
      color: 'text-purple-400'
    },
  ];

  const activeProjects = [
    { 
      title: 'E-Commerce Website', 
      freelancer: 'Alice Johnson',
      status: 'In Progress', 
      progress: 65,
      icon: FaBriefcase,
      statusColor: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    { 
      title: 'Mobile App Development', 
      freelancer: 'Bob Smith',
      status: 'In Review', 
      progress: 90,
      icon: FaClock,
      statusColor: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    { 
      title: 'Dashboard UI', 
      freelancer: 'Carol Davis',
      status: 'Completed', 
      progress: 100,
      icon: FaCheckCircle,
      statusColor: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
  ];

  const recentApplicants = [
    { name: 'David Wilson', title: 'React Developer', rating: 4.9, price: '$60/hr' },
    { name: 'Emma Brown', title: 'UI/UX Designer', rating: 4.8, price: '$55/hr' },
    { name: 'Frank Miller', title: 'Full Stack Developer', rating: 4.7, price: '$70/hr' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10"
      >
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-zinc-400 mt-2">
          Manage your projects and find the best freelancers.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-zinc-400">{metric.label}</div>
              <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} mt-1`}>
                {metric.change}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Projects & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Active Projects</h3>
          <div className="space-y-3">
            {activeProjects.map((project, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${project.bgColor}`}>
                    <project.icon className={`w-5 h-5 ${project.statusColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-zinc-400">{project.freelancer}</p>
                    <div className="mt-2 w-full bg-white/5 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          project.progress === 100 ? 'bg-green-500' : 
                          project.progress > 70 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{project.progress}% complete</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${project.statusColor} ${project.bgColor}`}>
                    {project.status}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Applicants</h3>
          <div className="space-y-3">
            {recentApplicants.map((applicant, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{applicant.name}</h4>
                    <p className="text-sm text-zinc-400">{applicant.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-yellow-400">⭐ {applicant.rating}</span>
                      <span className="text-sm text-zinc-400">{applicant.price}</span>
                    </div>
                  </div>
                  <button className="px-4 py-1 text-sm bg-violet-600 rounded-lg hover:bg-violet-700 transition">
                    View Profile
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <button className="mt-4 w-full py-3 text-center text-violet-400 border border-violet-400/30 rounded-xl hover:bg-violet-500/10 transition">
            Post a New Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;