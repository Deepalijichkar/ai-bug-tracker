const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bugRoutes = require('./routes/bugs');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected');
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/bugs', bugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('Bug Tracker API is running');
});

module.exports = app;