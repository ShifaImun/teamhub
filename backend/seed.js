const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
require('dotenv').config();

// Sample users data
const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'employee',
    department: 'Engineering',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1990-05-15'),
    hireDate: new Date('2020-03-01')
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    department: 'Product',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1988-08-20'),
    hireDate: new Date('2019-06-15')
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'employee',
    department: 'Design',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1992-12-03'),
    hireDate: new Date('2021-01-10')
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'employee',
    department: 'Marketing',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1995-02-10'),
    hireDate: new Date('2022-04-20')
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'admin',
    department: 'Analytics',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1985-11-25'),
    hireDate: new Date('2018-09-01')
  },
  {
    name: 'Lisa Brown',
    email: 'lisa.brown@company.com',
    role: 'employee',
    department: 'Human Resources',
    photo: 'https://via.placeholder.com/150',
    birthday: new Date('1993-07-08'),
    hireDate: new Date('2020-11-15')
  }
];

// Sample announcements data
const sampleAnnouncements = [
  {
    title: 'New Office Opening in Downtown',
    content: 'We are excited to announce the opening of our new office space in downtown. This modern facility will provide better collaboration spaces and amenities for our growing team.',
    created_by: null // Will be set to first user's ID
  },
  {
    title: 'Updated Remote Work Policy',
    content: 'Based on team feedback and our commitment to work-life balance, we are updating our remote work policy. Starting next quarter, employees will have the flexibility to work from home up to 3 days per week.',
    created_by: null
  },
  {
    title: 'Annual Company Retreat Announced',
    content: 'Mark your calendars! Our annual company retreat is scheduled for March 15-17 at the beautiful Mountain View Resort. This year\'s theme is "Innovation & Collaboration".',
    created_by: null
  },
  {
    title: 'New Health Benefits Package',
    content: 'We are pleased to announce an enhanced health benefits package for all employees. The new package includes improved dental coverage, mental health support, and wellness programs.',
    created_by: null
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teamhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    console.log('Cleared existing data');

    // Insert users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Set created_by for announcements to first user
    const firstUserId = users[0]._id;
    const announcementsWithUser = sampleAnnouncements.map(announcement => ({
      ...announcement,
      created_by: firstUserId
    }));

    // Insert announcements
    const announcements = await Announcement.insertMany(announcementsWithUser);
    console.log(`Inserted ${announcements.length} announcements`);

    console.log('Database seeded successfully!');
    console.log('\nSample data created:');
    console.log('- Users:', users.length);
    console.log('- Announcements:', announcements.length);
    console.log('\nYou can now test the API endpoints.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 