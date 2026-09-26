const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  deadline: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    clientName: {
      type: String,
      required: true
    },
    clientCountry: {
      type: String,
      default: 'Global'
    },
    budget: {
      type: Number,
      required: [true, 'Please provide total project budget'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'in-review', 'delivered'],
      default: 'planning'
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    deadline: {
      type: String,
      default: ''
    },
    milestones: [milestoneSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
