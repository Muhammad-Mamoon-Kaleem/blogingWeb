import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = { title, author, category, content };
    // Send this data to your backend
    fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    })
      .then((response) => response.json())
      .then((data) => console.log('Blog saved:', data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        <option value="Eco-Products">Eco-Products</option>
        <option value="Places">Places</option>
        <option value="Green Environment">Green Environment</option>
      </select>
      <ReactQuill
        value={content}
        onChange={setContent}
        className="h-48"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit Blog
      </button>
    </form>
  );
};

export default BlogForm;
