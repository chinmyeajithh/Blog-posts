const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const BlogPost = require("./models/BlogPost"); // Import your BlogPost model

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (ensure you have the correct connection string)
mongoose.connect('mongodb+srv://Chinmye:Chinni349@cluster0.lipvwss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  dbName: 'fsdmini',
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes

// 1. Get all blog posts
app.get('/blogposts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Create a new blog post
app.post('/blogposts', async (req, res) => {
  const { title, content } = req.body;
  
  const newPost = new BlogPost({
    title,
    content,
  });

  try {
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Update a blog post
app.put('/blogposts/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete a blog post
app.delete('/blogposts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted", post: deletedPost });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
