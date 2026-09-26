const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .delete(authorize('admin'), deleteClient);

module.exports = router;
