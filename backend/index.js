require('dotenv').config();
const express = require('express');
const Note = require('./Models/Note.js')
const Blog = require('./Models/Blog.js')
const app = express();
app.use(express.json());

/**
 * NOTES
 */
app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll();
    console.log(JSON.stringify(notes, null, 2))
    res.json(notes);
})
app.post('/api/notes', async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.json(note);
    } catch (error) {
        res.status(400).json({error});
    }
})
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(JSON.stringify(note));
    res.json(note)
  } else {
    res.status(404).end()
  }
})
app.put('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})
/**
 * BLOGS
 */
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
})
app.post('/api/blogs', async (req, res) => {
  try {
      const blog = await Blog.create(req.body);
      res.json(blog);
  } catch (error) {
      res.status(400).json({error});
  }
})
app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog){
    try {
        await blog.destroy();
        res.status(200).end();
    } catch (error) {
        res.status(400).json({error});
    }
  }else {
    res.status(404).end();
  } 
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})