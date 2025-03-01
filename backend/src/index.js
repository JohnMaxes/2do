const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('./db');

const userRoutes = require('./routes/users');
const folderRoutes = require('./routes/folders');
const fileRoutes = require('./routes/files');
const todoItemRoutes = require('./routes/todoitems');

const setupSwagger = require('../swagger');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/todoitems', todoItemRoutes);

setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});