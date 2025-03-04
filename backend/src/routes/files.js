const express = require('express');
const router = express.Router();
const { File, Folder, TodoItem } = require('../models/models');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

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

// Add a new file (note or todo list)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, type, title, content, items, parentId } = req.body;
    if (!userId || !type || !title) {
      return res.status(400).json({ message: 'userId, type, and title are required' });
    }

    const file = new File({
      userId: new mongoose.Types.ObjectId(userId),
      type, // 'Note' or 'TodoList'
      title,
      content,
      items: items ? JSON.parse(items) : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null
    });

    if (parentId) {
      const parentFolder = await Folder.findById(new mongoose.Types.ObjectId(parentId));
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      parentFolder.files.push(file._id);
      await parentFolder.save();
    }

    await file.save();
    console.log(`✅ File ${file._id} added successfully!`);
    res.json({ message: 'File added successfully', file });
  } catch (err) {
    console.error('Error adding new file:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Update a file (note or todo list)
router.put('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const { title, content } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (title) {
      file.title = title;
    }

    if (file.type === 'Note' && content) {
      file.content = content;
    }

    file.updatedAt = Date.now();
    await file.save();

    console.log(`✅ File ${fileId} updated successfully!`);
    res.json({ message: 'File updated successfully', file });
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Delete a file (note or todo list)
router.delete('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete all associated Todo items if the file is a TodoList
    if (file.type === 'TodoList') {
      await TodoItem.deleteMany({ todoListId: file._id });
    }

    if (file.parentId) {
      const parentFolder = await Folder.findById(file.parentId);
      if (parentFolder) {
        parentFolder.files.pull(fileId);
        await parentFolder.save();
      }
    }

    await File.findByIdAndDelete(fileId);
    console.log(`✅ File ${fileId} and associated Todo items deleted successfully!`);
    res.json({ message: 'File and associated Todo items deleted' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;