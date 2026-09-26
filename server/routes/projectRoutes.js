const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  toggleMilestone,
  deleteProject,
  getDashboardStats
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats/summary', getDashboardStats);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .delete(authorize('admin'), deleteProject);

router.patch('/:id/milestones/:milestoneId', toggleMilestone);

module.exports = router;
