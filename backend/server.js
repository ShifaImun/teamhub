const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const announcementRoutes = require("./routes/announcements");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teamhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/employees', require('./routes/employees'));
app.use("/api/announcements", announcementRoutes);
app.use('/api/celebrations', require('./routes/celebrations'));
app.use("/api/stats", require("./routes/stats"));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TeamHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 