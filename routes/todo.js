const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// Create a new To-Do item
router.post('/', async (req, res) => {
  const { text } = req.body;
  const userId = req.session.userId;
  try {
    const newTodo = new Todo({
      userId,
      text
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all To-Do items for a user
router.get('/', async (req, res) => {
  const userId = req.session.userId;
  try {
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a To-Do item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'To-Do item not found' });
    }
    todo.text = text !== undefined ? text : todo.text;
    todo.completed = completed !== undefined ? completed : todo.completed;
    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a To-Do item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Todo.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'To-Do item not found' });
    }
    res.status(200).json({ message: 'To-Do item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/summary', async (req, res) => {
  const userId = req.session.userId;
  try {
    const todos = await Todo.find({ userId });
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    res.status(200).json({ total, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task time spent
router.put('/:id/time', async (req, res) => {
  const { id } = req.params;
  const { timeSpent } = req.body;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }

    todo.timeSpent = (todo.timeSpent || 0) + timeSpent;
    await todo.save();

    res.send(todo);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Add a route to get total time spent on tasks
router.get('/total-time-spent', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }); // Adjust the query as necessary to match your schema
    const totalTimeSpent = todos.reduce((total, todo) => total + (todo.timeSpent || 0), 0);
    res.json({ totalTimeSpent });
  } catch (err) {
    res.status(500).send("Error fetching total time spent");
  }
});


module.exports = router;
