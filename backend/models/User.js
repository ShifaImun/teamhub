const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  birthday: {
    type: Date,
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating years of service
userSchema.virtual('yearsOfService').get(function() {
  const today = new Date();
  const hireDate = this.hireDate;
  const years = today.getFullYear() - hireDate.getFullYear();
  const monthDiff = today.getMonth() - hireDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
    return years - 1;
  }
  return years;
});

// Virtual for upcoming birthday
userSchema.virtual('upcomingBirthday').get(function() {
  const today = new Date();
  const birthday = new Date(this.birthday);
  const currentYear = today.getFullYear();
  
  // Set birthday to current year
  birthday.setFullYear(currentYear);
  
  // If birthday has passed this year, set to next year
  if (birthday < today) {
    birthday.setFullYear(currentYear + 1);
  }
  
  return birthday;
});

// Virtual for days until birthday
userSchema.virtual('daysUntilBirthday').get(function() {
  const today = new Date();
  const upcomingBirthday = this.upcomingBirthday;
  const diffTime = upcomingBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for upcoming work anniversary
userSchema.virtual('upcomingAnniversary').get(function() {
  const today = new Date();
  const hireDate = new Date(this.hireDate);
  const currentYear = today.getFullYear();
  
  // Set anniversary to current year
  hireDate.setFullYear(currentYear);
  
  // If anniversary has passed this year, set to next year
  if (hireDate < today) {
    hireDate.setFullYear(currentYear + 1);
  }
  
  return hireDate;
});

// Virtual for days until work anniversary
userSchema.virtual('daysUntilAnniversary').get(function() {
  const today = new Date();
  const upcomingAnniversary = this.upcomingAnniversary;
  const diffTime = upcomingAnniversary.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('User', userSchema); 