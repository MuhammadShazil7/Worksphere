// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext'; // Import ChatProvider
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobPage';
import FreelancersPage from './pages/FreelancersPage';
import FreelancerProfilePage from './pages/FreelancerProfilePage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/Auth/LoginPage';
// import RegisterPage from './pages/Auth/RegisterPage';
import RegisterSteps from './pages/Auth/RegisterSteps';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyProposalsPage from './pages/MyProposalsPage';
import MyJobsPage from './pages/MyJobsPage';
import CreateJobPage from './pages/CreateJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import MessagesPage from './pages/MessagesPage';

import './styles/globals.css';

function App() {
  return (
    <AuthProvider> {/* AuthProvider MUST be first */}
      <ChatProvider> {/* ChatProvider needs AuthProvider */}
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route path="freelancers" element={<FreelancersPage />} />
              <Route path="freelancers/:id" element={<FreelancerProfilePage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-proposals" element={<MyProposalsPage />} />
              <Route path="my-jobs" element={<MyJobsPage />} />
              <Route path="create-job" element={<CreateJobPage />} />
              <Route path="create-job" element={<CreateJobPage />} />
              <Route path="messages" element={<MessagesPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterSteps />} />
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: {
                duration: 3000,
              },
              error: {
                duration: 4000,
              },
            }}
          />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;