require('dotenv').config();
const express = require('express');
const Note = require('./Models/Note.js')
const app = express();
app.use(express.json());

app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll();
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})