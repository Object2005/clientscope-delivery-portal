const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'developer'],
      default: 'manager'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
