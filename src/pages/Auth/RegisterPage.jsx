// src/pages/Auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import Background from '../../components/ui/Background/Background';
import Container from '../../components/ui/Container/Container';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/input';
import Logo from '../../components/common/Logo';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { name, email, password, role } = formData;
      const result = await register({ name, email, password, role });
      
      console.log('Registration result:', result); // Debug log
      
      toast.success('Account created successfully! 🎉');
      
      // Wait a moment then redirect
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Container className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-zinc-400 mt-2">Join thousands of freelancers and companies</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8">
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={<FaUser className="w-5 h-5" />}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<FaEnvelope className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                icon={<FaLock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<FaLock className="w-5 h-5" />}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`px-4 py-3 rounded-xl border transition ${
                      formData.role === 'freelancer'
                        ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                  >
                    🎨 Freelancer
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-3 rounded-xl border transition ${
                      formData.role === 'client'
                        ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'client' })}
                  >
                    🏢 Client
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full justify-center"
                loading={loading}
              >
                Create Account
                <FaArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>

          <p className="text-center text-zinc-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </Background>
  );
};

export default RegisterPage;