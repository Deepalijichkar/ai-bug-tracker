const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');
const jwt = require('jsonwebtoken');

const getUser = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Get all projects for logged in user
router.get('/', async (req, res) => {
  try {
    const user = getUser(req);
    const projects = await Project.find({
      $or: [{ owner: user.id }, { members: user.id }]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const user = getUser(req);
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: user.id,
      members: [user.id]
    });
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add member to project
router.post('/:id/members', async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: user._id } },
      { new: true }
    ).populate('members', 'name email');
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;