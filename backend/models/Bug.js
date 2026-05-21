const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  tags: [String],
  aiSummary: { type: String },
  aiSeverity: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Bug', bugSchema);