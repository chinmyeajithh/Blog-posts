import React, { useState, useEffect } from "react";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [editing, setEditing] = useState(null);

  // Fetch posts from the backend
  useEffect(() => {
    fetch("http://localhost:5000/blogposts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // Handle new post submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:5000/blogposts/${editing._id}`
      : "http://localhost:5000/blogposts";
    const method = editing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editing) {
          setPosts(posts.map((post) => (post._id === data._id ? data : post)));
        } else {
          setPosts([...posts, data]);
        }
        setNewPost({ title: "", content: "" });
        setEditing(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  // Handle delete post
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/blogposts/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(posts.filter((post) => post._id !== id));
        alert("Post deleted");
      })
      .catch((error) => console.error("Error:", error));
  };

  // Handle edit post
  const handleEdit = (post) => {
    setEditing(post);
    setNewPost({ title: post.title, content: post.content });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Blog Posts</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-center text-gray-700">{editing ? "Edit Post" : "Create New Post"}</h2>

        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Title"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Content"
          rows="4"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          {editing ? "Update Post" : "Add Post"}
        </button>
      </form>

      <div className="mt-8 w-full max-w-4xl">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-3xl font-bold text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.content}</p>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => handleEdit(post)}
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
