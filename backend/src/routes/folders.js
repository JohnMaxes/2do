const express = require('express');
const router = express.Router();
const { File, Folder, TodoItem } = require('../models/models');
const mongoose = require('mongoose');

const deleteFolderRecursive = async (folderId) => {
  try {
    const subfolders = await Folder.find({ parentId: folderId });

    for (const subfolder of subfolders) {
      await deleteFolderRecursive(subfolder._id);
    }

    const files = await File.find({ parentId: folderId });
    for (const file of files) {
      if (file.type === 'TodoList') {
        await TodoItem.deleteMany({ todoListId: file._id });
      }
      await File.findByIdAndDelete(file._id);
    }

    await Folder.deleteMany({ parentId: folderId });
  } catch (error) {
    console.error('Error in recursive folder deletion:', error);
  }
};

// Get all folders and files for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const folders = await Folder.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('folders files');
    res.json(folders);
  } catch (err) {
    console.error('Error getting folders:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Add a new folder
router.post('/', async (req, res) => {
  try {
    const { userId, name, parentId } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ message: 'userId and name are required' });
    }

    const folder = new Folder({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      folders: [],
      files: [],
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null
    });

    if (parentId) {
      const parentFolder = await Folder.findById(new mongoose.Types.ObjectId(parentId));
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      parentFolder.folders.push(folder._id);
      await parentFolder.save();
    }

    await folder.save();
    console.log(`✅ Folder ${folder._id} added successfully!`);
    res.json({ message: 'Folder added successfully', folder });
  } catch (err) {
    console.error('Error adding new folder:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Delete a folder and its contents
router.delete('/:id', async (req, res) => {
  try {
    const folderId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folderId' });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await deleteFolderRecursive(folderId);
    await Folder.findByIdAndDelete(folderId);

    console.log(`✅ Folder ${folderId} and all its contents deleted successfully!`);
    res.json({ message: 'Folder and all its contents deleted' });
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;