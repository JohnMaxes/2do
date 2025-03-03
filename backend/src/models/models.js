const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// File Schema (Note or TodoList)
const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Note', 'TodoList'], required: true },
  title: String,
  content: String, // For notes
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoItem' }], // For todo lists
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }
});

// Folder Schema
const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }
});

// TodoItem Schema
const todoItemSchema = new mongoose.Schema({
  description: String,
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  todoListId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true }
});

const User = mongoose.model('User', userSchema);
const File = mongoose.model('File', fileSchema);
const Folder = mongoose.model('Folder', folderSchema);
const TodoItem = mongoose.model('TodoItem', todoItemSchema);

module.exports = { User, File, Folder, TodoItem };