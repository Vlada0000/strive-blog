import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap'; 

const UploadAvatar = ({ avatarUrl, onAvatarUploaded, id }) => { 
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    setLoading(true); 
    setError(null); 

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authors/${id}/avatar`, { 
        method: 'PATCH',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Avatar uploaded successfully:', data); 
        onAvatarUploaded(data.avatar); 
      } else {
        const errorData = await response.json();
        console.error('Failed to upload avatar:', errorData); 
        setError('Failed to upload avatar. Please try again.'); 
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('An error occurred while uploading the avatar.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <Form.Group controlId="formFile">
        <Form.Label>Upload Avatar</Form.Label>
        <Form.Control 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={loading} 
        />
      </Form.Group>
      <Button 
        variant="primary" 
        onClick={handleUpload}
        disabled={loading} 
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
            Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>} 
    </div>
  );
};

export default UploadAvatar;
