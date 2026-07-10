// backend/src/controllers/paymentController.js
import Payment from '../models/Payment.js';
import Job from '../models/Job.js';

const PLATFORM_FEE = parseInt(process.env.PLATFORM_FEE) || 10;

// @desc    Create manual payment
// @route   POST /api/payments/create
// @access  Private
export const createPayment = async (req, res) => {
  try {
    const { projectId, paymentMethod, referenceNumber } = req.body;

    const project = await Job.findById(projectId)
      .populate('client', 'name email')
      .populate('freelancer', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment'
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      project: projectId,
      status: { $in: ['pending', 'processing'] }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'A payment already exists for this project'
      });
    }

    const amount = project.budget;
    const platformFee = amount * (PLATFORM_FEE / 100);
    const freelancerAmount = amount - platformFee;

    // Create payment record
    const payment = await Payment.create({
      project: projectId,
      client: req.user.id,
      freelancer: project.freelancer._id,
      amount: amount,
      currency: 'PKR',
      platformFee: platformFee,
      freelancerAmount: freelancerAmount,
      status: 'processing',
      paymentMethod: paymentMethod || 'manual',
      referenceNumber: referenceNumber || '',
      description: `Payment for project: ${project.title}`
    });

    res.status(201).json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        platformFee: payment.platformFee,
        freelancerAmount: payment.freelancerAmount,
        status: payment.status,
        invoiceNumber: payment.invoiceNumber,
        paymentMethod: payment.paymentMethod
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment'
    });
  }
};

// @desc    Freelancer confirms payment receipt
// @route   POST /api/payments/confirm/:paymentId
// @access  Private (Freelancer only)
export const confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is the freelancer
    if (payment.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the freelancer can confirm payment receipt'
      });
    }

    if (payment.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Payment is not in processing state'
      });
    }

    payment.status = 'completed';
    payment.confirmedByFreelancer = true;
    payment.confirmedAt = new Date();
    payment.completedAt = new Date();
    await payment.save();

    // Update project status
    await Job.findByIdAndUpdate(payment.project, { status: 'in-progress' });

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm payment'
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const query = {
      $or: [
        { client: req.user.id },
        { freelancer: req.user.id }
      ]
    };

    const payments = await Payment.find(query)
      .populate('project', 'title')
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    const stats = {
      total: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      totalEarned: payments
        .filter(p => p.freelancer._id.toString() === req.user.id && p.status === 'completed')
        .reduce((sum, p) => sum + p.freelancerAmount, 0),
      totalSpent: payments
        .filter(p => p.client._id.toString() === req.user.id && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter(p => p.status === 'processing').length,
      completed: payments.filter(p => p.status === 'completed').length,
      platformFees: payments.reduce((sum, p) => sum + (p.platformFee || 0), 0)
    };

    res.status(200).json({
      success: true,
      stats,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('project', 'title description')
      .populate('client', 'name email')
      .populate('freelancer', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.client._id.toString() !== req.user.id && 
        payment.freelancer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment'
    });
  }
};