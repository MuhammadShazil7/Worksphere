export const navLinks = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'jobs', label: 'Jobs', path: '/jobs' },
  { id: 'pricing', label: 'Pricing', path: '/pricing' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_CONFIG = {
  name: 'WorkSphere',
  description: 'Connect with top freelancers and companies',
  version: '1.0.0',
};