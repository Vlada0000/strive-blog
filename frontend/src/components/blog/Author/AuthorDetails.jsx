import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import UploadAvatar from '../Uploads/UploadAvatar';
import { ModeContext } from '../../../context/ModeContext';
import './AuthorDetails.css';

const AuthorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useContext(ModeContext);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal visibility states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch( `${process.env.REACT_APP_BACKEND_URL}/authors/${id}`); 
        if (!response.ok) throw new Error('Failed to fetch author data');
        
        const data = await response.json();
        setAuthor(data);
        setFormData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          birthDate: data.birthDate,
          avatar: data.avatar,
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching author details');
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEditAuthor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update author');
      
      setAuthor(formData);
      setShowEditModal(false);
    } catch (error) {
      setError('Error updating author');
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete author');
      
      navigate('/authors');
    } catch (error) {
      setError('Error deleting author');
    }
  };

  const handleAvatarUploaded = (newAvatarUrl) => {
    setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;

  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container fluid="sm" className="mt-5">
      <Card className="author-detail-card">
        <Card.Img variant="top" src={formData.avatar} alt="Author Avatar" />
        <Card.Body>
          <Card.Title>{`${formData.name} ${formData.surname}`}</Card.Title>
          <Card.Text><strong>Email:</strong> {formData.email}</Card.Text>
          <Card.Text><strong>Birth Date:</strong> {formData.birthDate}</Card.Text>

          {mode === 'dev' && (
            <>
              <Button variant="secondary" onClick={() => setShowEditModal(true)}>
                Edit Details
              </Button>
              <Button variant="danger" className="ms-2" onClick={() => setShowDeleteModal(true)}>
                Delete Author
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Edit Author Modal */}
      {mode === 'dev' && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Author Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditAuthor}>
              <Form.Group controlId="name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="surname" className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="birthDate" className="mt-3">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="avatar" className="mt-3">
                <Form.Label>Avatar</Form.Label>
                <UploadAvatar avatarUrl={formData.avatar} onAvatarUploaded={handleAvatarUploaded} id={id} />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {mode === 'dev' && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this author? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAuthor}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AuthorDetails;
