// backend/src/controllers/deliveryController.js
import Delivery from '../models/Delivery.js';
import Job from '../models/Job.js';
import Payment from '../models/Payment.js';

// @desc    Submit delivery
// @route   POST /api/deliveries
// @access  Private (Freelancer only)
export const submitDelivery = async (req, res) => {
  try {
    const { projectId, title, message, files } = req.body;

    const project = await Job.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the freelancer on the project
    if (project.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit delivery for this project'
      });
    }

    // Check if there's already a pending delivery
    const existingDelivery = await Delivery.findOne({
      project: projectId,
      status: { $in: ['submitted', 'in-review', 'revision-requested'] }
    });

    if (existingDelivery) {
      return res.status(400).json({
        success: false,
        message: 'There is already a pending delivery for this project'
      });
    }

    // Get the latest version number
    const latestDelivery = await Delivery.findOne({ project: projectId })
      .sort({ version: -1 });

    const version = (latestDelivery?.version || 0) + 1;

    const delivery = await Delivery.create({
      project: projectId,
      freelancer: req.user.id,
      client: project.client,
      title,
      message,
      files: files || [],
      version,
      status: 'submitted'
    });

    res.status(201).json({
      success: true,
      delivery
    });
  } catch (error) {
    console.error('Submit delivery error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit delivery'
    });
  }
};

// @desc    Get deliveries for a project
// @route   GET /api/deliveries/project/:projectId
// @access  Private
export const getDeliveries = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Job.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the client or freelancer on the project
    if (project.client.toString() !== req.user.id && 
        project.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view deliveries for this project'
      });
    }

    const deliveries = await Delivery.find({ project: projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get deliveries'
    });
  }
};

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
export const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('freelancer', 'name email')
      .populate('client', 'name email')
      .populate('project', 'title')
      .populate('previousVersion');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Check authorization
    if (delivery.freelancer._id.toString() !== req.user.id && 
        delivery.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this delivery'
      });
    }

    res.status(200).json({
      success: true,
      delivery
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get delivery'
    });
  }
};

// @desc    Review delivery (Accept/Reject)
// @route   PUT /api/deliveries/:id/review
// @access  Private (Client only)
export const reviewDelivery = async (req, res) => {
  try {
    const { action, feedback } = req.body;

    if (!['approve', 'reject', 'request-revision'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve", "reject", or "request-revision"'
      });
    }

    const delivery = await Delivery.findById(req.params.id)
      .populate('project', 'title freelancer client');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Check if user is the client
    if (delivery.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the client can review deliveries'
      });
    }

    if (delivery.status !== 'submitted' && delivery.status !== 'in-review') {
      return res.status(400).json({
        success: false,
        message: 'This delivery has already been reviewed'
      });
    }

    let newStatus = 'in-review';
    let projectStatus = 'in-progress';
    
    switch (action) {
      case 'approve':
        newStatus = 'approved';
        delivery.approvedAt = new Date();
        projectStatus = 'completed';
        
        // Release payment to freelancer
        const payment = await Payment.findOne({
          project: delivery.project._id,
          status: 'escrow'
        });
        
        if (payment) {
          payment.status = 'released';
          payment.releasedAt = new Date();
          await payment.save();
        }
        break;
        
      case 'reject':
        newStatus = 'rejected';
        break;
        
      case 'request-revision':
        newStatus = 'revision-requested';
        break;
    }

    delivery.status = newStatus;
    delivery.feedback = feedback || '';
    delivery.reviewedAt = new Date();
    await delivery.save();

    // Update project status if completed
    if (projectStatus === 'completed') {
      await Job.findByIdAndUpdate(delivery.project._id, { status: 'completed' });
    }

    res.status(200).json({
      success: true,
      delivery
    });
  } catch (error) {
    console.error('Review delivery error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to review delivery'
    });
  }
};

// @desc    Get delivery history for freelancer
// @route   GET /api/deliveries/history/freelancer
// @access  Private (Freelancer)
export const getDeliveryHistory = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ 
      freelancer: req.user.id,
      status: { $in: ['approved', 'rejected'] }
    })
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(20);

    const stats = {
      total: deliveries.length,
      approved: deliveries.filter(d => d.status === 'approved').length,
      rejected: deliveries.filter(d => d.status === 'rejected').length,
      approvalRate: deliveries.length > 0 
        ? (deliveries.filter(d => d.status === 'approved').length / deliveries.length * 100).toFixed(1)
        : 0
    };

    res.status(200).json({
      success: true,
      stats,
      deliveries
    });
  } catch (error) {
    console.error('Get delivery history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get delivery history'
    });
  }
};