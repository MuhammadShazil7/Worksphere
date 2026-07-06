// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

import Background from '../components/ui/Background/Background';
import Navbar from '../components/landing/Navbar/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <Background>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full pt-20 sm:pt-24"
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </Background>
  );
};

export default MainLayout;