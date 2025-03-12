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

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - title
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID
 *         type:
 *           type: string
 *           description: The file type (Note or TodoList)
 *         title:
 *           type: string
 *           description: The file title
 *         content:
 *           type: string
 *           description: The file content (for notes)
 *         items:
 *           type: array
 *           items:
 *             type: string
 *           description: The todo items (for todo lists)
 *         parentId:
 *           type: string
 *           description: The parent folder ID
 *       example:
 *         userId: 60d0fe4f5311236168a109ca
 *         type: Note
 *         title: Sample Note
 *         content: This is a sample note.
 *         items: []
 *         parentId: 60d0fe4f5311236168a109cb
 */

/**
 * @swagger
 * /api/files:
 *   post:
 *     summary: Add a new file (note or todo list)
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/File'
 *     responses:
 *       200:
 *         description: The file was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Parent folder not found
 *       500:
 *         description: Some server error
 */
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
/**
 * @swagger
 * /api/files/{id}:
 *   put:
 *     summary: Update a file (note or todo list)
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The file title
 *               content:
 *                 type: string
 *                 description: The file content (for notes)
 *     responses:
 *       200:
 *         description: The file was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       400:
 *         description: Bad request
 *       404:
 *         description: File not found
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file (note or todo list)
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file ID
 *     responses:
 *       200:
 *         description: The file and its associated Todo items were successfully deleted
 *       400:
 *         description: Invalid fileId
 *       404:
 *         description: File not found
 *       500:
 *         description: Some server error
 */
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