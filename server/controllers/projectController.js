const Project = require('../models/Project');
const { projects, activities, saveToDisk, addActivity } = require('../data/mockStore');

// @desc    Get all projects with optional filtering
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { status, search } = req.query;

    let projectList = [...projects];

    // Try MongoDB
    try {
      let query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } }
        ];
      }
      const dbProjects = await Project.find(query).sort({ createdAt: -1 });
      if (dbProjects && dbProjects.length > 0) {
        return res.json({ success: true, count: dbProjects.length, data: dbProjects });
      }
    } catch (err) {
      // Fallback
    }

    if (status && status !== 'all') {
      projectList = projectList.filter((p) => p.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      projectList = projectList.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: projectList.length, data: projectList });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve projects' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);
      if (project) {
        return res.json({ success: true, data: project });
      }
    } catch (err) {
      // Fallback
    }

    const mockProj = projects.find((p) => p._id === id);
    if (!mockProj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: mockProj });
  } catch (error) {
    console.error('Error fetching single project:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving project' });
  }
};

// @desc    Create new project with milestones
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      clientName,
      clientCountry,
      budget,
      currency,
      deadline,
      milestones
    } = req.body;

    if (!title || !clientName || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Client Name, and Total Budget'
      });
    }

    const formattedMilestones = Array.isArray(milestones)
      ? milestones.map((m, idx) => ({
          id: m.id || `m_${Date.now()}_${idx}`,
          title: m.title || `Milestone ${idx + 1}`,
          amount: Number(m.amount) || 0,
          deadline: m.deadline || '',
          status: m.status || 'pending'
        }))
      : [];

    try {
      const project = await Project.create({
        title,
        description: description || '',
        clientName,
        clientCountry: clientCountry || 'Global',
        budget: Number(budget),
        currency: currency || 'USD',
        status: 'in-progress',
        deadline: deadline || '',
        milestones: formattedMilestones
      });
      addActivity('New Project Contract', `${title} ($${Number(budget).toLocaleString()}) for ${clientName}`, req.user?.name);
      return res.status(201).json({ success: true, data: project });
    } catch (dbErr) {
      // Fallback
      const newProj = {
        _id: `proj_${Date.now()}`,
        title,
        description: description || '',
        clientName,
        clientCountry: clientCountry || 'Global',
        budget: Number(budget),
        currency: currency || 'USD',
        status: 'in-progress',
        startDate: new Date().toISOString().split('T')[0],
        deadline: deadline || '',
        milestones: formattedMilestones,
        createdAt: new Date()
      };
      projects.unshift(newProj);
      saveToDisk();
      addActivity('New Project Contract', `${title} ($${Number(budget).toLocaleString()}) for ${clientName}`, req.user?.name);
      return res.status(201).json({ success: true, data: newProj });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

// @desc    Toggle or update milestone status
// @route   PATCH /api/projects/:id/milestones/:milestoneId
// @access  Private
const toggleMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed'];
    const newStatus = validStatuses.includes(status) ? status : 'completed';

    // Try MongoDB
    try {
      const project = await Project.findById(id);
      if (project) {
        const milestone = project.milestones.find((m) => m.id === milestoneId || m._id?.toString() === milestoneId);
        if (milestone) {
          milestone.status = newStatus;
          
          const allCompleted = project.milestones.every((m) => m.status === 'completed');
          if (allCompleted) {
            project.status = 'delivered';
          } else if (project.status === 'delivered') {
            project.status = 'in-progress';
          }

          await project.save();
          addActivity('Milestone Status Updated', `"${milestone.title}" set to ${newStatus} in ${project.title}`, req.user?.name);
          return res.json({ success: true, data: project });
        }
      }
    } catch (err) {
      // Fallback
    }

    const mockProj = projects.find((p) => p._id === id);
    if (!mockProj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestone = mockProj.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    milestone.status = newStatus;

    const allCompleted = mockProj.milestones.every((m) => m.status === 'completed');
    if (allCompleted) {
      mockProj.status = 'delivered';
    } else if (mockProj.status === 'delivered') {
      mockProj.status = 'in-progress';
    }

    saveToDisk();
    addActivity('Milestone Status Updated', `"${milestone.title}" marked as ${newStatus} in ${mockProj.title}`, req.user?.name);

    res.json({ success: true, data: mockProj });
  } catch (error) {
    console.error('Error toggling milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone status' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Project.findByIdAndDelete(id);
    } catch (dbErr) {
      // Ignore
    }

    const index = projects.findIndex((p) => p._id === id);
    if (index !== -1) {
      const removed = projects.splice(index, 1)[0];
      saveToDisk();
      addActivity('Project Archived', `"${removed.title}" removed by Administrator`, req.user?.name);
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/projects/stats/summary
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let currentProjects = [...projects];

    try {
      const dbProjects = await Project.find();
      if (dbProjects && dbProjects.length > 0) {
        currentProjects = dbProjects;
      }
    } catch (err) {
      // Fallback
    }

    const totalProjects = currentProjects.length;
    const activeProjects = currentProjects.filter((p) => p.status === 'in-progress').length;
    const deliveredProjects = currentProjects.filter((p) => p.status === 'delivered' || p.status === 'in-review').length;
    const totalPipelineValue = currentProjects.reduce((acc, p) => acc + (p.budget || 0), 0);

    let totalMilestones = 0;
    let completedMilestones = 0;

    currentProjects.forEach((p) => {
      if (Array.isArray(p.milestones)) {
        totalMilestones += p.milestones.length;
        completedMilestones += p.milestones.filter((m) => m.status === 'completed').length;
      }
    });

    const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        deliveredProjects,
        totalPipelineValue,
        totalMilestones,
        completedMilestones,
        completionRate
      }
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics' });
  }
};

// @desc    Get system audit activity logs
// @route   GET /api/projects/audit/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve activity trail' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  toggleMilestone,
  deleteProject,
  getDashboardStats,
  getActivities
};
