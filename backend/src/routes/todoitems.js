const express = require('express');
const router = express.Router();
const { TodoItem, File } = require('../models/models');
const mongoose = require('mongoose');

// Get all todo items for a todo list
router.get('/:todoListId', async (req, res) => {
  try {
    const todoListId = req.params.todoListId;
    if (!mongoose.Types.ObjectId.isValid(todoListId)) {
      return res.status(400).json({ message: 'Invalid todoListId' });
    }

    const todoItems = await TodoItem.find({ todoListId: new mongoose.Types.ObjectId(todoListId) });
    res.json(todoItems);
  } catch (err) {
    console.error('Error getting todo items:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Add a new todo item
router.post('/', async (req, res) => {
  try {
    const { todoListId, description } = req.body;
    if (!todoListId || !description) {
      return res.status(400).json({ message: 'todoListId and description are required' });
    }

    const todoItem = new TodoItem({
      description,
      isDone: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      todoListId: new mongoose.Types.ObjectId(todoListId)
    });
    await todoItem.save();
    const todoList = await File.findById(new mongoose.Types.ObjectId(todoListId));
    todoList.items.push(todoItem._id);
    await todoList.save();
    console.log(`✅ Todo item ${todoItem._id} added successfully!`);
    res.json({ message: 'Todo item added successfully', todoItem });
  } catch (err) {
    console.error('Error adding new todo item:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Update a todo item
router.put('/:id', async (req, res) => {
  try {
    const { description, isDone } = req.body;
    const todoItem = await TodoItem.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      { description, isDone, updatedAt: Date.now() },
      { new: true }
    );
    console.log(`✅ Todo item ${todoItem._id} updated successfully!`);
    res.json({ message: 'Todo item updated successfully', todoItem });
  } catch (err) {
    console.error('Error updating todo item:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Delete a todo item
router.delete('/:id', async (req, res) => {
  try {
    await TodoItem.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    console.log(`✅ Todo item ${req.params.id} deleted successfully!`);
    res.json({ message: 'Todo item deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo item:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;