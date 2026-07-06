// src/components/landing/Dashboard/Dashboard.jsx
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaStar, 
  FaShoppingBag, 
  FaMusic, 
  FaThLarge,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

import Container from '../../ui/Container/Container';
import Card from '../../ui/Card/card';

const Dashboard = () => {
  const metrics = [
    { 
      label: 'Monthly Revenue', 
      value: '$24,580', 
      change: '+18.6%', 
      icon: FaChartLine,
      color: 'text-green-400'
    },
    { 
      label: 'Rating', 
      value: '4.9', 
      change: '+0.3', 
      icon: FaStar,
      color: 'text-yellow-400'
    },
  ];

  const projects = [
    { 
      title: 'E-Commerce Website', 
      status: 'Completed', 
      icon: FaShoppingBag,
      statusColor: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    { 
      title: 'Dashboard UI', 
      status: 'Completed', 
      icon: FaThLarge,
      statusColor: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    { 
      title: 'Spotify', 
      status: 'Mobile App', 
      icon: FaMusic,
      statusColor: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    { 
      title: 'Payment Gateway', 
      status: 'Pending', 
      icon: FaClock,
      statusColor: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-time <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Track your freelancing success with our comprehensive dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-zinc-500">vs last month</span>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <Card key={index} className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${project.bgColor}`}>
                      <project.icon className={`w-5 h-5 ${project.statusColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium ${project.statusColor}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${project.statusColor} ${project.bgColor}`}>
                      {project.status === 'Completed' ? (
                        <FaCheckCircle className="w-4 h-4" />
                      ) : (
                        <FaExclamationCircle className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Dashboard;