// backend/src/controllers/subscriptionController.js
import User from '../models/User.js';
import Payment from '../models/Payment.js';

const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    proposals: 5,
    features: ['Basic profile', '5 proposals/month', 'Standard support']
  },
  starter: {
    name: 'Starter',
    price: 29,
    proposals: 5,
    features: ['Basic analytics', '5 proposals/month', 'Job alerts', 'Standard support']
  },
  professional: {
    name: 'Professional',
    price: 79,
    proposals: -1, // Unlimited
    features: ['Featured profile', 'Unlimited proposals', 'Priority support', 'Advanced analytics', 'Team tools']
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    proposals: -1, // Unlimited
    features: ['Dedicated manager', 'Custom integrations', '24/7 support', 'White-label', 'All Professional features']
  }
};

// @desc    Get current subscription
// @route   GET /api/subscription/current
// @access  Private
export const getCurrentSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if subscription is expired
    if (user.subscription.endDate && new Date() > user.subscription.endDate) {
      user.subscription.status = 'expired';
      await user.save();
    }

    const subscription = {
      plan: user.subscription.plan,
      status: user.subscription.status,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      autoRenew: user.subscription.autoRenew,
      features: PLANS[user.subscription.plan]?.features || PLANS.free.features,
      proposalsRemaining: user.subscription.plan === 'free' || user.subscription.plan === 'starter'
        ? Math.max(0, user.freeProposalsLimit - user.freeProposalsUsed)
        : -1 // Unlimited
    };

    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription'
    });
  }
};

// @desc    Subscribe to a plan (Manual payment)
// @route   POST /api/subscription/subscribe
// @access  Private
export const subscribe = async (req, res) => {
  try {
    const { plan, billingInfo, paymentMethod, referenceNumber } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    const user = await User.findById(req.user.id);
    const planData = PLANS[plan];

    // Calculate amount
    const amount = planData.price;
    const platformFee = amount * 0.10;
    const totalAmount = amount + platformFee;

    // Create payment record
    const payment = await Payment.create({
      project: null, // Not associated with a project
      client: req.user.id,
      freelancer: null,
      amount: totalAmount,
      currency: 'USD',
      platformFee: platformFee,
      freelancerAmount: amount,
      status: 'processing',
      paymentMethod: paymentMethod || 'manual',
      referenceNumber: referenceNumber || '',
      description: `Subscription: ${planData.name} Plan - ${planData.price}/month`,
      invoiceNumber: `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    });

    // Update user subscription (will be confirmed after payment verification)
    // For now, set to pending
    user.subscription.plan = plan;
    user.subscription.status = 'pending';
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date();
    user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
    
    if (billingInfo) {
      user.billingInfo = billingInfo;
    }

    await user.save();

    res.status(201).json({
      success: true,
      payment,
      subscription: {
        plan: user.subscription.plan,
        status: 'pending',
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to subscribe'
    });
  }
};

// @desc    Confirm subscription (After payment)
// @route   POST /api/subscription/confirm
// @access  Private
export const confirmSubscription = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const user = await User.findById(payment.client);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Activate subscription
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    user.subscription.status = 'active';
    user.subscription.startDate = now;
    user.subscription.endDate = endDate;
    
    // Reset free proposals
    user.freeProposalsUsed = 0;
    user.freeProposalsResetDate = now;

    payment.status = 'completed';
    payment.completedAt = now;

    await user.save();
    await payment.save();

    res.status(200).json({
      success: true,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate
      }
    });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm subscription'
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel'
      });
    }

    user.subscription.status = 'cancelled';
    user.subscription.autoRenew = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        endDate: user.subscription.endDate
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

// @desc    Get plan features
// @route   GET /api/subscription/plans
// @access  Public
export const getPlans = async (req, res) => {
  try {
    const plans = Object.keys(PLANS).map(key => ({
      id: key,
      name: PLANS[key].name,
      price: PLANS[key].price,
      proposals: PLANS[key].proposals,
      features: PLANS[key].features
    }));

    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans'
    });
  }
};

// @desc    Check if user can submit proposal
// @route   GET /api/subscription/can-propose
// @access  Private
export const canPropose = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if user has active subscription that allows unlimited proposals
    if (user.subscription.plan === 'professional' || user.subscription.plan === 'enterprise') {
      if (user.subscription.status === 'active') {
        return res.status(200).json({
          success: true,
          canPropose: true,
          remaining: -1,
          message: 'Unlimited proposals available'
        });
      }
    }

    // Check if proposal limit has been reached
    const now = new Date();
    const resetDate = user.freeProposalsResetDate;
    
    // Reset counter if month has changed
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      user.freeProposalsUsed = 0;
      user.freeProposalsResetDate = now;
      await user.save();
    }

    const remaining = user.freeProposalsLimit - user.freeProposalsUsed;

    res.status(200).json({
      success: true,
      canPropose: remaining > 0,
      remaining: remaining,
      limit: user.freeProposalsLimit,
      used: user.freeProposalsUsed,
      plan: user.subscription.plan
    });
  } catch (error) {
    console.error('Can propose error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check proposal eligibility'
    });
  }
};

// @desc    Track proposal usage
// @route   POST /api/subscription/track-proposal
// @access  Private
export const trackProposal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // If user has paid plan, don't track
    if (user.subscription.plan === 'professional' || user.subscription.plan === 'enterprise') {
      return res.status(200).json({
        success: true,
        message: 'Proposal tracked (unlimited plan)'
      });
    }

    user.freeProposalsUsed += 1;
    await user.save();

    res.status(200).json({
      success: true,
      used: user.freeProposalsUsed,
      remaining: user.freeProposalsLimit - user.freeProposalsUsed
    });
  } catch (error) {
    console.error('Track proposal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track proposal'
    });
  }
};