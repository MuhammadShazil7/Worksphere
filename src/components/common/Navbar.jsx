import { useState } from 'react';
import { Menu, X, Sparkles, User, LogOut } from 'react-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import Container from '../ui/Container';
import Button from '../ui/Button';
import Logo from './Logo';
import { useScroll } from '../../hooks/useScroll';
import { useAuth } from '../../hooks/useAuth';
import { navLinks } from '../../constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScroll(20);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'py-3' : 'py-5'
    }`}>
      <Container>
        <nav className={`
          flex items-center justify-between rounded-2xl border transition-all duration-300 px-6 py-4
          ${isScrolled
            ? 'border-white/10 bg-black/60 shadow-2xl shadow-primary-500/10 backdrop-blur-2xl'
            : 'border-white/5 bg-white/5 backdrop-blur-xl'
          }
        `}>
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                className={({ isActive }) => `
                  relative text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}
                `}
              >
                {link.label}
                {({ isActive }) => isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                  />
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-300">
                  {user.name}
                </span>
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="glass-effect rounded-2xl p-6 lg:hidden">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.id}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        text-lg font-medium transition-colors duration-300
                        ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}
                      `}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  
                  <hr className="border-white/10" />
                  
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                        <User className="w-5 h-5 text-zinc-400" />
                        <span className="text-sm text-zinc-300">{user.name}</span>
                      </div>
                      <Button onClick={handleLogout} className="w-full justify-center">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="secondary" className="w-full justify-center" onClick={() => navigate('/login')}>
                        Login
                      </Button>
                      <Button className="w-full justify-center" onClick={() => navigate('/register')}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

export default Navbar;