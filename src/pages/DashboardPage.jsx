// src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';
import { FreelancerDashboard, ClientDashboard } from '../components/landing/Dashboard';
import Container from '../components/ui/Container/Container';
import { Navigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="py-12">
      <Container>
        {/* Role Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <FaUser className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-zinc-400">
                Role: <span className="capitalize text-violet-400">{user.role}</span>
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-lg text-sm text-zinc-400">
            Member since {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Role-Based Dashboard */}
        {user.role === 'freelancer' ? (
          <FreelancerDashboard user={user} />
        ) : user.role === 'client' ? (
          <ClientDashboard user={user} />
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400">Invalid user role</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default DashboardPage;