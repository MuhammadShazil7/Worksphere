// backend/src/routes/adminRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Payment from '../models/Payment.js';
import Proposal from '../models/Proposal.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// ============ STATS ============
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      totalJobs,
      openJobs,
      totalProposals,
      totalPayments,
      pendingPayments,
      activeSubscriptions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'freelancer' }),
      User.countDocuments({ role: 'client' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Proposal.countDocuments(),
      Payment.countDocuments(),
      Payment.countDocuments({ status: 'processing' }),
      User.countDocuments({ 'subscription.status': 'active' })
    ]);

    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
    const platformFees = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalJobs,
        openJobs,
        totalProposals,
        totalRevenue,
        pendingPayments,
        activeSubscriptions,
        platformFees
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
});

// ============ USERS ============
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, role, isVerified, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isVerified, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// ============ SUBSCRIPTIONS ============
// Add/Update subscription
router.put('/users/:id/subscription', async (req, res) => {
  try {
    const { plan, status, autoRenew } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.subscription = {
      plan: plan || 'free',
      status: status || 'active',
      startDate: status === 'active' ? new Date() : user.subscription?.startDate,
      endDate: status === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : user.subscription?.endDate,
      autoRenew: autoRenew !== undefined ? autoRenew : true
    };

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

// Remove subscription
router.delete('/users/:id/subscription', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.subscription = {
      plan: 'free',
      status: 'inactive',
      startDate: null,
      endDate: null,
      autoRenew: false
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription removed successfully'
    });
  } catch (error) {
    console.error('Remove subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove subscription'
    });
  }
});

// ============ JOBS ============
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Admin jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs'
    });
  }
});

// ============ PAYMENTS ============
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Admin payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

export default router;