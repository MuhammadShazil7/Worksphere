// backend/src/controllers/jobController.js
import Job from '../models/Job.js';

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
  try {
    req.body.client = req.user.id;
    const job = await Job.create(req.body);
    
    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { category, experienceLevel, projectType, minBudget, maxBudget } = req.query;
    
    // Build filter object
    const filter = { status: 'open' };
    
    if (category) {
      filter.category = category;
    }
    
    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }
    
    if (projectType) {
      filter.projectType = projectType;
    }
    
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseInt(minBudget);
      if (maxBudget) filter.budget.$lte = parseInt(maxBudget);
    }
    
    const jobs = await Job.find(filter)
      .populate('client', 'name email avatar headline')
      .populate({
        path: 'proposals',
        select: 'status freelancer createdAt',
        populate: {
          path: 'freelancer',
          select: 'name email avatar'
        }
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email avatar headline rating totalProjects')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancer',
          select: 'name email avatar headline rating hourlyRate'
        }
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check authorization
    if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Prevent updating certain fields
    const allowedUpdates = [
      'title', 'description', 'category', 'skills', 
      'budget', 'duration', 'experienceLevel', 'projectType', 'status'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    job = await Job.findByIdAndUpdate(
      req.params.id, 
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check authorization
    if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get jobs by client
// @route   GET /api/jobs/client/:clientId
// @access  Private
export const getJobsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    console.log('Client ID from params:', clientId);
    console.log('User ID from token:', req.user.id);
    console.log('User ID from token (string):', req.user.id.toString());
    
    // Check if user is authorized
    const isAuthorized = 
      clientId === req.user.id || 
      clientId === req.user._id || 
      clientId === req.user.id.toString() ||
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these jobs'
      });
    }

    const jobs = await Job.find({ client: clientId })
      .populate('client', 'name email avatar')
      .populate({
        path: 'proposals',
        select: 'status freelancer createdAt',
        populate: {
          path: 'freelancer',
          select: 'name email avatar'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get jobs by client error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get job stats for client
// @route   GET /api/jobs/stats/client
// @access  Private
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { client: req.user._id } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);

    const totalJobs = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalBudget = stats.reduce((sum, stat) => sum + stat.totalBudget, 0);

    res.status(200).json({
      success: true,
      stats: {
        total: totalJobs,
        totalBudget,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
export const searchJobs = async (req, res) => {
  try {
    const { q, category, minBudget, maxBudget, experienceLevel } = req.query;
    
    // Build search filter
    const filter = { status: 'open' };
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }
    
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseInt(minBudget);
      if (maxBudget) filter.budget.$lte = parseInt(maxBudget);
    }
    
    const jobs = await Job.find(filter)
      .populate('client', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};