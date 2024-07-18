const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  timeSpent: {
    type: Number,
    default: 0 // Time spent in minutes
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
