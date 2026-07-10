// backend/src/controllers/withdrawalController.js
import Withdrawal from '../models/Withdrawal.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

// @desc    Request withdrawal
// @route   POST /api/withdrawals/request
// @access  Private (Freelancer only)
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, method, accountDetails } = req.body;

    // Check if user is freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can request withdrawals'
      });
    }

    // Check if amount is valid
    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is $10'
      });
    }

    // Check if freelancer has enough earnings
    const payments = await Payment.find({
      freelancer: req.user.id,
      status: 'completed'
    });

    const totalEarned = payments.reduce((sum, p) => sum + p.freelancerAmount, 0);
    const totalWithdrawn = await Withdrawal.aggregate([
      { $match: { freelancer: req.user._id, status: { $in: ['completed', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const withdrawnAmount = totalWithdrawn.length > 0 ? totalWithdrawn[0].total : 0;
    const availableBalance = totalEarned - withdrawnAmount;

    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`
      });
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      freelancer: req.user.id,
      amount: amount,
      currency: 'USD',
      method: method,
      accountDetails: accountDetails,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to request withdrawal'
    });
  }
};

// @desc    Get withdrawal history
// @route   GET /api/withdrawals/history
// @access  Private
export const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ freelancer: req.user.id })
      .sort({ createdAt: -1 });

    const stats = {
      total: withdrawals.length,
      pending: withdrawals.filter(w => w.status === 'pending').length,
      processing: withdrawals.filter(w => w.status === 'processing').length,
      completed: withdrawals.filter(w => w.status === 'completed').length,
      totalAmount: withdrawals
        .filter(w => w.status === 'completed')
        .reduce((sum, w) => sum + w.amount, 0)
    };

    res.status(200).json({
      success: true,
      stats,
      withdrawals
    });
  } catch (error) {
    console.error('Get withdrawal history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get withdrawal history'
    });
  }
};

// @desc    Get available balance
// @route   GET /api/withdrawals/balance
// @access  Private
export const getAvailableBalance = async (req, res) => {
  try {
    // Get completed payments (earned)
    const payments = await Payment.find({
      freelancer: req.user.id,
      status: 'completed'
    });

    const totalEarned = payments.reduce((sum, p) => sum + p.freelancerAmount, 0);

    // Get completed and processing withdrawals
    const withdrawals = await Withdrawal.find({
      freelancer: req.user.id,
      status: { $in: ['completed', 'processing'] }
    });

    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalEarned - totalWithdrawn;

    res.status(200).json({
      success: true,
      balance: {
        totalEarned,
        totalWithdrawn,
        available: availableBalance,
        pending: await Withdrawal.countDocuments({
          freelancer: req.user.id,
          status: 'pending'
        })
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get balance'
    });
  }
};

// @desc    Cancel withdrawal request
// @route   PUT /api/withdrawals/:id/cancel
// @access  Private
export const cancelWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    // Check if user owns this withdrawal
    if (withdrawal.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this withdrawal'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending withdrawals can be cancelled'
      });
    }

    withdrawal.status = 'cancelled';
    await withdrawal.save();

    res.status(200).json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error('Cancel withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel withdrawal'
    });
  }
};

// @desc    Admin: Process withdrawal
// @route   PUT /api/withdrawals/:id/process
// @access  Private (Admin only)
export const processWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can process withdrawals'
      });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending withdrawals can be processed'
      });
    }

    withdrawal.status = 'processing';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.status(200).json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal'
    });
  }
};

// @desc    Admin: Complete withdrawal
// @route   PUT /api/withdrawals/:id/complete
// @access  Private (Admin only)
export const completeWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can complete withdrawals'
      });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Only processing withdrawals can be completed'
      });
    }

    withdrawal.status = 'completed';
    withdrawal.completedAt = new Date();
    await withdrawal.save();

    res.status(200).json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error('Complete withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete withdrawal'
    });
  }
};