// src/components/landing/Hero/Hero.jsx
import HeroBadge from './HeroBadge';
import HeroContent from './HeroContent';
import HeroButtons from './HeroButtons';
import HeroStats from './HeroStats';
import HeroImage from './HeroImage';
import TrustedCompanies from './TrustedCompanies';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 min-h-[calc(100vh-80px)] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <HeroBadge />
            <HeroContent />
            <HeroButtons />
            <HeroStats />
            <TrustedCompanies />
          </div>
          
          {/* Right Image */}
          <div className="hidden lg:block">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;