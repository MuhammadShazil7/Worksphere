// backend/src/scripts/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const seedFreelancers = async () => {
  try {
    await User.deleteMany({ role: 'freelancer' });

    const freelancers = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'freelancer',
        headline: 'Senior React Developer',
        bio: 'I build amazing web applications with React and Node.js',
        location: 'Remote',
        hourlyRate: 75,
        skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
        rating: 4.9,
        totalProjects: 47,
        isVerified: true
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        role: 'freelancer',
        headline: 'UI/UX Designer',
        bio: 'Creating beautiful and intuitive user experiences',
        location: 'New York, NY',
        hourlyRate: 65,
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        rating: 4.8,
        totalProjects: 32,
        isVerified: true
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        role: 'freelancer',
        headline: 'Full Stack Developer',
        bio: 'Full stack developer with expertise in Python and React',
        location: 'San Francisco, CA',
        hourlyRate: 85,
        skills: ['Python', 'Django', 'React', 'AWS', 'Docker'],
        rating: 4.9,
        totalProjects: 53,
        isVerified: true
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'password123',
        role: 'freelancer',
        headline: 'Mobile App Developer',
        bio: 'Building cross-platform mobile apps with React Native',
        location: 'Remote',
        hourlyRate: 70,
        skills: ['React Native', 'Flutter', 'iOS', 'Android'],
        rating: 4.7,
        totalProjects: 28,
        isVerified: false
      },
      {
        name: 'Emma Brown',
        email: 'emma@example.com',
        password: 'password123',
        role: 'freelancer',
        headline: 'DevOps Engineer',
        bio: 'Automating infrastructure and deployment pipelines',
        location: 'Austin, TX',
        hourlyRate: 90,
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
        rating: 4.9,
        totalProjects: 39,
        isVerified: true
      }
    ];

    await User.insertMany(freelancers);
    console.log('✅ Freelancers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding freelancers:', error);
    process.exit(1);
  }
};

seedFreelancers();