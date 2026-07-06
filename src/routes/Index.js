import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import JobsPage from '../pages/JobsPage';
import PricingPage from '../pages/PricingPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'jobs',
        element: <JobsPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);