const express = require('express');
const router = express.Router();
const { TodoItem, File } = require('../models/models');
const mongoose = require('mongoose');

// Get all todo items for a todo list
/**
 * @swagger
 * components:
 *   schemas:
 *     TodoItem:
 *       type: object
 *       required:
 *         - todoListId
 *         - description
 *       properties:
 *         todoListId:
 *           type: string
 *           description: The ID of the todo list
 *         description:
 *           type: string
 *           description: The description of the todo item
 *         isDone:
 *           type: boolean
 *           description: The status of the todo item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the todo item
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the todo item
 *       example:
 *         todoListId: 60d0fe4f5311236168a109ca
 *         description: Sample Todo Item
 *         isDone: false
 *         createdAt: 2021-06-22T14:48:00.000Z
 *         updatedAt: 2021-06-22T14:48:00.000Z
 */

/**
 * @swagger
 * /api/todoitems/{todoListId}:
 *   get:
 *     summary: Get all todo items for a todo list
 *     tags: [TodoItems]
 *     parameters:
 *       - in: path
 *         name: todoListId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo list
 *     responses:
 *       200:
 *         description: A list of todo items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TodoItem'
 *       400:
 *         description: Invalid todoListId
 *       500:
 *         description: Some server error
 */
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
/**
 * @swagger
 * /api/todoitems:
 *   post:
 *     summary: Add a new todo item
 *     tags: [TodoItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoItem'
 *     responses:
 *       200:
 *         description: The todo item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoItem'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */
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
/**
 * @swagger
 * /api/todoitems/{id}:
 *   put:
 *     summary: Update a todo item
 *     tags: [TodoItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the todo item
 *               isDone:
 *                 type: boolean
 *                 description: The status of the todo item
 *     responses:
 *       200:
 *         description: The todo item was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoItem'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Todo item not found
 *       500:
 *         description: Some server error
 */
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
/**
 * @swagger
 * /api/todoitems/{id}:
 *   delete:
 *     summary: Delete a todo item
 *     tags: [TodoItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo item
 *     responses:
 *       200:
 *         description: The todo item was successfully deleted
 *       400:
 *         description: Invalid todo item ID
 *       404:
 *         description: Todo item not found
 *       500:
 *         description: Some server error
 */
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