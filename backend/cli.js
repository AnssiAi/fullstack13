require('dotenv').config();
const Blog = require('./Models/Blog.js');

const printNotes = async () => {
    const blogs = await Blog.findAll();
    blogs.forEach(blog => console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes.`));
};

printNotes();