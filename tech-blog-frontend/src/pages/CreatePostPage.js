// src/pages/CreatePostPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to create a post.');
        setLoading(false);
        return;
      }

      await axios.post(
        'http://127.0.0.1:8000/api/posts/',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/'); // Redirect to home page after successful post creation
    } catch (err) {
      console.error('Error creating post:', err); // Log error for debugging
      if (err.response) {
        // Handle specific errors based on the response status
        if (err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (err.response.status === 400) {
          setError('Validation error. Please check your input fields.');
        } else {
          setError('Failed to create post. Please try again later.');
        }
      } else if (err.request) {
        // No response received from the server
        setError('No response from the server. Check your network connection.');
      } else {
        // Other errors (e.g., client-side issues)
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="create-post-page">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
