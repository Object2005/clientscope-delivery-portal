const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide primary contact name'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Please provide client enterprise/company name'],
      trim: true
    },
    country: {
      type: String,
      default: 'United States'
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'lead', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);
