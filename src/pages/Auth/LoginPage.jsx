// src/pages/Auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import Background from '../../components/ui/Background/Background';
import Container from '../../components/ui/Container/Container';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/input';
import Logo from '../../components/common/Logo';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
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
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-zinc-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8">
            <div className="space-y-4">
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
                placeholder="Enter your password"
                icon={<FaLock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5" />
                  <span className="text-zinc-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-violet-400 hover:text-violet-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full justify-center"
                loading={loading}
              >
                Sign In
                <FaArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>

          <p className="text-center text-zinc-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Container>
    </Background>
  );
};

export default LoginPage;