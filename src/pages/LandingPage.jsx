// src/pages/LandingPage.jsx
import Hero from '../components/landing/Hero/Hero';
import Dashboard from '../components/landing/Dashboard/Dashboard';
import Features from '../components/ui/Features';
import Stats from '../components/ui/Stats';
import Testimonials from '../components/ui/Testimonials';

const LandingPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <Dashboard />
      <Testimonials />
    </div>
  );
};

export default LandingPage;