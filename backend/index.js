const express = require('express');
const app = express();

const { PORT } = require('./util/config.js');
const { connectToDatabase } = require('./util/db.js');

const errorHandler = require('./util/errorHandler.js');
const notesRouter = require('./Controllers/notes.js');
const blogsRouter = require('./Controllers/blogs.js');
const usersRouter = require('./Controllers/users.js');
const loginRouter = require('./Controllers/login.js');
const authorsRouter = require('./Controllers/authors.js');
const adminRouter = require('./Controllers/admin.js');
const readListRouter = require('./Controllers/readingLists.js');

app.use(express.json());
app.use('/api/notes', notesRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/readinglists', readListRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
      console.log(`server running on port: ${PORT}`);
  })
};

start();