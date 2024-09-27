import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/posts/');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto mt-4">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800">No Posts Available</h2>
        <p className="text-gray-600">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="home-page max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-5xl font-bold mb-8 text-gray-900 text-center">Recent Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105">
            <Link to={`/post/${post.id}`} className="block p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">
                  {post.author ? post.author.username || 'Unknown' : 'Unknown'}
                </span>
                <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-US') : 'Unknown Date'}</span>
              </div>
            </Link>
            <div className="bg-gray-100 px-6 py-3">
              <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
