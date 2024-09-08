import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap'; 
import { AuthContext } from '../../../context/AuthContext'; 
import './CommentForm.css'; 

const CommentForm = ({ postId, onAddComment }) => {
  const { author } = useContext(AuthContext); // Retrieve user info from context
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postId) {
      alert('Invalid post ID');
      return;
    }

    if (content.trim() === '') {
      alert('Comment content cannot be empty');
      return;
    }

    const newComment = {
      content,
      author: author.email, // Use the user's email as the author
      postId,
    };

    setLoading(true); // Show loading state
    setError(null); // Clear any previous errors
    setSuccess(null); // Clear any previous success messages

    try {
      await onAddComment(newComment); // Call the function to add a comment
      setContent(''); // Clear the input field after successful submission
      setSuccess('Comment added successfully!'); // Show success message
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.'); // Show error message
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  if (!author) {
    return <p>Loading user information...</p>; // Display a loading message if the author is not yet loaded
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="commentContent" className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
      </Form.Group>
      <Form.Group controlId="commentAuthor" className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          value={author.email} 
          readOnly
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>} 
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Comment'}
      </Button>
    </Form>
  );
};

export default CommentForm;
