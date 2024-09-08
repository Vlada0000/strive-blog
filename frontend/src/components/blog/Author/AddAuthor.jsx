import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const AddAuthor = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const authorData = { name, bio, photo };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(authorData),
      });

      if (response.ok) {
        setSuccess('Author added successfully!');
        setError(null);
        setName('');
        setBio('');
        setPhoto('');
      } else {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to add author');
        setSuccess(null);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Add New Author</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="authorName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="authorBio" className="mt-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter author's biography"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="authorPhoto" className="mt-3">
          <Form.Label>Photo URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL for author's photo (optional)"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Author'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddAuthor;
