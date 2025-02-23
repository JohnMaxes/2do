const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String
});

const noteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const todoListSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoItem' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const todoItemSchema = new mongoose.Schema({
  todoListId: mongoose.Schema.Types.ObjectId,
  description: String,
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);
const TodoList = mongoose.model('TodoList', todoListSchema);
const TodoItem = mongoose.model('TodoItem', todoItemSchema);

module.exports = { User, Note, TodoList, TodoItem };