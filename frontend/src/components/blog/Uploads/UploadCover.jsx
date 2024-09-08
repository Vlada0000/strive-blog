import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const UploadCover = ({ postId, onCoverUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    if (!postId) {
      setError('Post ID is missing. Please try again.');
      return;
    }

    const formData = new FormData();
    formData.append('coverImage', file);

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${postId}/cover`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image. Please try again.');
      }

      const data = await response.json();
      setSuccess('Cover image uploaded successfully!');
      onCoverUploaded(data.cover); 
    } catch (error) {
      setError(error.message || 'An error occurred while uploading the cover image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container fluid="sm" className="mt-5">
      <h2 className="mb-4">Upload Blog Post Cover</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group>
        <Form.Label>Select an Image</Form.Label>
        <Form.Control 
          type="file" 
          onChange={handleFileChange} 
          disabled={uploading} 
        />
      </Form.Group>
      <Button 
        onClick={handleUpload} 
        variant="primary" 
        className="mt-3" 
        disabled={uploading} 
      >
        {uploading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
            Uploading...
          </>
        ) : (
          'Upload Cover'
        )}
      </Button>
    </Container>
  );
};

export default UploadCover;
