const express = require('express');
const router = express.Router();
const { Note, TodoList, TodoItem } = require('./models');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all notes for a user
router.get('/notes/:userId', async (req, res) => {
  try {
    const notes = await Note.find({ userId: mongoose.Types.ObjectId(req.params.userId) });
    res.json(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new note with optional image
router.post('/notes', upload.single('image'), async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const note = new Note({
      userId: mongoose.Types.ObjectId(userId),
      title,
      content,
      imageUrl
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a note with optional image
router.put('/notes/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl, updatedAt: Date.now() },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all todo lists for a user
router.get('/todolists/:userId', async (req, res) => {
  try {
    const todoLists = await TodoList.find({ userId: mongoose.Types.ObjectId(req.params.userId) });
    res.json(todoLists);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new todo list
router.post('/todolists', async (req, res) => {
  try {
    const { userId, title } = req.body;
    const todoList = new TodoList({
      userId: mongoose.Types.ObjectId(userId),
      title
    });
    await todoList.save();
    res.json(todoList);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a todo list
router.put('/todolists/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const todoList = await TodoList.findByIdAndUpdate(
      req.params.id,
      { title, updatedAt: Date.now() },
      { new: true }
    );
    res.json(todoList);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a todo list
router.delete('/todolists/:id', async (req, res) => {
  try {
    await TodoList.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo list deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all todo items for a todo list
router.get('/todoitems/:todoListId', async (req, res) => {
  try {
    const todoItems = await TodoItem.find({ todoListId: mongoose.Types.ObjectId(req.params.todoListId) });
    res.json(todoItems);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new todo item
router.post('/todoitems', async (req, res) => {
  try {
    const { todoListId, description } = req.body;
    const todoItem = new TodoItem({
      todoListId: mongoose.Types.ObjectId(todoListId),
      description
    });
    await todoItem.save();
    res.json(todoItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a todo item
router.put('/todoitems/:id', async (req, res) => {
  try {
    const { description, isDone } = req.body;
    const todoItem = await TodoItem.findByIdAndUpdate(
      req.params.id,
      { description, isDone, updatedAt: Date.now() },
      { new: true }
    );
    res.json(todoItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a todo item
router.delete('/todoitems/:id', async (req, res) => {
  try {
    await TodoItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo item deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;