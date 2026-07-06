// backend/src/controllers/proposalController.js
import Proposal from '../models/Proposal.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Create a proposal
// @route   POST /api/proposals
// @access  Private (Freelancer only)
export const createProposal = async (req, res) => {
  try {
    const { jobId, coverLetter, proposedBudget, estimatedDuration } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting proposals'
      });
    }

    // Check if freelancer already applied
    const existingProposal = await Proposal.findOne({
      job: jobId,
      freelancer: req.user.id
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this job'
      });
    }

    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can submit proposals'
      });
    }

    // Create proposal
    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user.id,
      coverLetter,
      proposedBudget,
      estimatedDuration
    });

    // Add proposal to job
    job.proposals.push(proposal._id);
    await job.save();

    res.status(201).json({
      success: true,
      proposal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all proposals for a job (Client only)
// @route   GET /api/proposals/job/:jobId
// @access  Private (Client who owns the job)
export const getProposalsByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the client who posted the job
    if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these proposals'
      });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name email avatar headline rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get freelancer's proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
export const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'name email avatar'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update proposal status (Accept/Reject)
// @route   PUT /api/proposals/:id/status
// @access  Private (Client who owns the job)
export const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }

    const proposal = await Proposal.findById(req.params.id)
      .populate('job', 'client title');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Check if user is the client who owns the job
    if (proposal.job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this proposal'
      });
    }

    // If accepting, update job status and assign freelancer
    if (status === 'accepted') {
      // Update job
      await Job.findByIdAndUpdate(proposal.job._id, {
        status: 'in-progress',
        freelancer: proposal.freelancer
      });

      // Reject all other proposals for this job
      await Proposal.updateMany(
        { 
          job: proposal.job._id,
          _id: { $ne: proposal._id }
        },
        { status: 'rejected' }
      );
    }

    proposal.status = status;
    await proposal.save();

    res.status(200).json({
      success: true,
      proposal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Withdraw a proposal
// @route   PUT /api/proposals/:id/withdraw
// @access  Private (Freelancer who submitted)
export const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Check if user is the freelancer who submitted
    if (proposal.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this proposal'
      });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw a proposal that has been accepted or rejected'
      });
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    res.status(200).json({
      success: true,
      message: 'Proposal withdrawn successfully',
      proposal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private (Freelancer or Client)
export const getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('freelancer', 'name email avatar headline rating')
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'name email avatar'
        }
      });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Check if user is the freelancer or the client
    const isFreelancer = proposal.freelancer._id.toString() === req.user.id;
    const isClient = proposal.job.client._id.toString() === req.user.id;

    if (!isFreelancer && !isClient && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this proposal'
      });
    }

    res.status(200).json({
      success: true,
      proposal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};