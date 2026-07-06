// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube,
  FaHeart
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdLocationOn, 
  MdPhone 
} from 'react-icons/md';

import Container from '../ui/Container/Container';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Find Jobs', path: '/jobs' },
      { label: 'Find Freelancers', path: '/freelancers' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'About Us', path: '/about' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <footer className="border-t border-white/5 py-8 sm:py-12 mt-10 sm:mt-20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-zinc-400 mt-3 sm:mt-4 max-w-md text-xs sm:text-sm">
              Connecting talented freelancers with ambitious companies worldwide.
              Built with <FaHeart className="inline w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> for the future of work.
            </p>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              <a href="#" className="text-zinc-400 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/5 rounded-lg">
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/5 rounded-lg">
                <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/5 rounded-lg">
                <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/5 rounded-lg">
                <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition text-xs sm:text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition text-xs sm:text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <MdEmail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">support@worksphere.com</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <MdLocationOn className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <MdPhone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs sm:text-sm text-zinc-500 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
          <p>&copy; {currentYear} WorkSphere. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;