const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');

async function analyzeWithAI(title, description) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a bug tracking assistant. Analyze this bug report and respond in JSON only, no markdown:
    Title: ${title}
    Description: ${description}
    
    Respond with exactly this JSON format:
    {"summary": "one sentence summary", "severity": "low or medium or high or critical", "tags": ["tag1", "tag2"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.log('AI error:', err.message);
    return null;
  }
}

router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }
    const { title, description, priority, status, assignedTo } = req.body;
    const aiResult = await analyzeWithAI(title, description);
    console.log('AI Result:', aiResult);
    const bug = new Bug({
      title,
      description,
      priority,
      status,
      assignedTo: assignedTo || null,
      createdBy: userId,
      aiSummary: aiResult?.summary || '',
      aiSeverity: aiResult?.severity || '',
      tags: aiResult?.tags || []
    });
    const savedBug = await bug.save();
    res.status(201).json(savedBug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/fix-suggestion', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a senior software engineer. A bug has been reported:
    Title: ${bug.title}
    Description: ${bug.description}
    Severity: ${bug.aiSeverity}
    Tags: ${bug.tags?.join(', ')}
    
    Provide a practical fix suggestion in this JSON format only, no markdown:
    {
      "rootCause": "one sentence explaining the likely root cause",
      "steps": ["step 1", "step 2", "step 3"],
      "codeHint": "a short code snippet or pseudocode if applicable",
      "estimatedTime": "estimated time to fix e.g. 2 hours"
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const suggestion = JSON.parse(cleaned);
    res.json(suggestion);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;