const express = require('express');
const router = express.Router();
const { Folder, File } = require('../models/models');
const mongoose = require('mongoose');

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
    res.json(folder);
  } catch (err) {
    console.error('Error adding new folder:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Recursive function to delete a folder and its contents
const deleteFolderAndContents = async (folderId) => {
  const folder = await Folder.findById(folderId).populate('folders files');
  if (!folder) return;

  // Delete all files in the folder
  for (const fileId of folder.files) {
    await File.findByIdAndDelete(fileId);
  }

  // Recursively delete all subfolders
  for (const subfolderId of folder.folders) {
    await deleteFolderAndContents(subfolderId);
  }

  // Delete the folder itself
  await Folder.findByIdAndDelete(folderId);
};

// Delete a folder
router.delete('/:id', async (req, res) => {
  try {
    const folderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folderId' });
    }

    await deleteFolderAndContents(folderId);

    res.json({ message: 'Folder and its contents deleted' });
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;