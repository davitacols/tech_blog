import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`http://127.0.0.1:8000/api/posts/${id}/`);
        const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/comments/?post_id=${id}`);
        
        // Add null checks
        if (postResponse.data && typeof postResponse.data === 'object') {
          setPost(postResponse.data);
        } else {
          throw new Error('Invalid post data received');
        }
        
        if (Array.isArray(commentsResponse.data)) {
          setComments(commentsResponse.data);
        } else {
          throw new Error('Invalid comments data received');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to comment.');
        return;
      }

      const newCommentData = { content: newComment, post: id };

      // Optimistically update the comments
      setComments((prevComments) => [
        ...prevComments,
        { ...newCommentData, author: { username: 'You' } }, // Simulated user
      ]);

      await axios.post(
        'http://127.0.0.1:8000/api/comments/',
        newCommentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment('');
      // Refresh comments after adding a new one
      const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/comments/?post_id=${id}`);
      if (Array.isArray(commentsResponse.data)) {
        setComments(commentsResponse.data);
      } else {
        throw new Error('Invalid comments data received');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      handleCommentError(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        setError('Unauthorized. Please log in to comment.');
      } else if (err.response.status === 400) {
        setError('Validation error. Please check your comment content.');
      } else {
        setError('Failed to post comment. Please try again later.');
      }
    } else {
      setError('Network error. Please check your connection.');
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="blog-post-page">
      {post && (
        <>
          <h2>{post.title}</h2>
          <p>By {post.author?.username || 'Unknown'} on {new Date(post.created_at).toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

          <hr />
          <h3>Comments</h3>
          <ul className="list-group">
            {comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                <strong>{comment.author?.username || 'Unknown'}:</strong> {comment.content}
              </li>
            ))}
          </ul>

          <form onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <label htmlFor="comment-input">Add a Comment</label>
              <textarea
                id="comment-input"
                className="form-control"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                disabled={commentLoading}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary mt-2" disabled={commentLoading}>
              {commentLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default BlogPostPage;