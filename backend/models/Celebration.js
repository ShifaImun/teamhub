const mongoose = require('mongoose');

const celebrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: String,
    required: true,
    enum: ['Birthday', 'Work Anniversary', 'Custom Celebration'],
    default: 'Custom Celebration'
  },
  date: {
    type: Date,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, for celebrations not tied to specific employees
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating days until celebration
celebrationSchema.virtual('daysUntil').get(function() {
  const today = new Date();
  const celebrationDate = new Date(this.date);
  const currentYear = today.getFullYear();
  
  // Set celebration date to current year
  celebrationDate.setFullYear(currentYear);
  
  // If the date has passed this year, set to next year
  if (celebrationDate < today) {
    celebrationDate.setFullYear(currentYear + 1);
  }
  
  const diffTime = celebrationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for checking if celebration is today
celebrationSchema.virtual('isToday').get(function() {
  return this.daysUntil === 0;
});

// Virtual for upcoming celebration date
celebrationSchema.virtual('upcomingDate').get(function() {
  const today = new Date();
  const celebrationDate = new Date(this.date);
  const currentYear = today.getFullYear();
  
  celebrationDate.setFullYear(currentYear);
  
  if (celebrationDate < today) {
    celebrationDate.setFullYear(currentYear + 1);
  }
  
  return celebrationDate;
});

module.exports = mongoose.model('Celebration', celebrationSchema);