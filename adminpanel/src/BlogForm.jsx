import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import Quill CSS

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]); // Store manually uploaded images
  const [content, setContent] = useState(''); // State for Quill editor content
  const [quillImages, setQuillImages] = useState([]); // Store images from Quill

  // Initialize Quill instance
  const quillRef = useRef();

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
          ],
        },
      });

      quillRef.current.on('text-change', () => {
        setContent(quillRef.current.root.innerHTML); // Update content
        const imgElements = quillRef.current.root.querySelectorAll('img');
        const imageSources = Array.from(imgElements).map(img => img.src); // Extract image URLs
        setQuillImages(imageSources); // Set Quill images
      });
    }
  }, []);

  const handleFileChange = (e) => {
    setImages(e.target.files); // Handle manual file uploads
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('content', content); // Submit Quill content

    // Append manually uploaded images
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    // Append Quill images
    quillImages.forEach((imageSrc) => {
      formData.append('images', imageSrc); // Include image URLs from Quill
    });

    try {
      const response = await axios.post('http://localhost:5000/api/admin/addblog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Blog added successfully!');
        setTitle('');
        setAuthor('');
        setCategory('');
        setContent('');
        setImages([]); 
        setQuillImages([]); // Clear Quill images
      } else {
        alert(`Failed to add blog: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting the blog:', error);
      alert('An error occurred while adding the blog.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-gray-700">Add New Blog</h1>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="">Select Category</option>
        <option value="Eco-Products">Eco-Products</option>
        <option value="Places">Places</option>
        <option value="Green Environment">Green Environment</option>
      </select>

      {/* Quill Editor */}
      <div className="border rounded p-2 bg-gray-50">
        <label className="block mb-2 font-bold text-gray-700">Content</label>
        <div id="editor-container" className="min-h-[200px] w-full"></div>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Submit Blog
      </button>
    </form>
  );
};

export default BlogForm;
