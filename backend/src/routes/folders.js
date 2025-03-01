const express = require('express');
const router = express.Router();
const { File, Folder, TodoItem } = require('../models/models');
const mongoose = require('mongoose');

const deleteFolderRecursive = async (folderId) => {
    try {
      console.log(`🔄 Checking for subfolders and files in: ${folderId}`);
  
      // 🔹 Step 1: Get all subfolders inside this folder
      const subfolders = await Folder.find({ parentId: folderId });
      console.log(`📂 Found ${subfolders.length} subfolders in folder: ${folderId}`);
  
      // 🔹 Step 2: Delete all subfolders and their contents first
      for (const subfolder of subfolders) {
        console.log(`🗑️ Recursively deleting subfolder: ${subfolder._id}`);
        await deleteFolderRecursive(subfolder._id);
      }
  
      // 🔹 Step 3: Delete all files in this folder
      const files = await File.find({ parentId: folderId });
      console.log(`📄 Found ${files.length} files in folder: ${folderId}`);
  
      await File.deleteMany({ parentId: folderId });
  
      // 🔹 Step 4: Delete the subfolders themselves
      await Folder.deleteMany({ parentId: folderId });
  
      console.log(`✅ Successfully deleted all contents of folder: ${folderId}`);
    } catch (error) {
      console.error('❌ Error in recursive folder deletion:', error);
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
        res.json(folder);
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

    console.log(`🔴 Starting recursive deletion for folder: ${folderId}`);

    // 🔹 Step 1: Recursively delete all subfolders and files
    await deleteFolderRecursive(folderId);

    // 🔹 Step 2: Delete the main folder
    await Folder.findByIdAndDelete(folderId);

    console.log(`✅ Folder ${folderId} and all its contents deleted successfully!`);

    res.json({ message: 'Folder and all its contents deleted' });
  } catch (err) {
    console.error('❌ Error deleting folder:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;