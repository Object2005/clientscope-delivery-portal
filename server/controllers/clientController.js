const Client = require('../models/Client');
const { clients, saveToDisk, addActivity } = require('../data/mockStore');

// @desc    Get all enterprise clients
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    try {
      const dbClients = await Client.find().sort({ createdAt: -1 });
      if (dbClients && dbClients.length > 0) {
        return res.json({ success: true, count: dbClients.length, data: dbClients });
      }
    } catch (err) {
      // Fallback
    }

    return res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve clients' });
  }
};

// @desc    Create new enterprise client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  try {
    const { name, company, country, email, phone, status } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, company name, and email are required fields'
      });
    }

    try {
      const client = await Client.create({
        name,
        company,
        country: country || 'United States',
        email,
        phone: phone || '',
        status: status || 'active'
      });
      addActivity('New Client Onboarded', `${company} (${country || 'Global'}) registered by ${req.user?.name || 'Manager'}`);
      return res.status(201).json({ success: true, data: client });
    } catch (dbErr) {
      // Fallback in-memory
      const newClient = {
        _id: `cl_${Date.now()}`,
        name,
        company,
        country: country || 'United States',
        email,
        phone: phone || '',
        status: status || 'active',
        createdAt: new Date()
      };
      clients.unshift(newClient);
      saveToDisk();
      addActivity('New Client Onboarded', `${company} (${country || 'Global'}) registered by ${req.user?.name || 'Manager'}`);
      return res.status(201).json({ success: true, data: newClient });
    }
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ success: false, message: 'Failed to register client' });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Client.findByIdAndDelete(id);
    } catch (dbErr) {
      // Ignore
    }

    const index = clients.findIndex((c) => c._id === id);
    if (index !== -1) {
      const removed = clients.splice(index, 1)[0];
      saveToDisk();
      addActivity('Client Account Removed', `${removed.company} was deleted from database`);
    }

    res.json({ success: true, message: 'Client removed successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, message: 'Failed to delete client' });
  }
};

module.exports = {
  getClients,
  createClient,
  deleteClient
};
