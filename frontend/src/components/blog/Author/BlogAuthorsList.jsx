import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Button, Container, Modal, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ModeContext } from '../../../context/ModeContext';
import './BlogAuthorsList.css';

const BlogAuthorsList = () => {
  const { mode } = useContext(ModeContext); // Access the mode from context
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Form state for adding a new author
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    avatar: '',
  });

  const limit = 10;

  // Function to fetch authors
  const fetchAuthors = async () => {
    try {
      const response = await fetch(`http://localhost:4000/authors?_page=${page}&_limit=${limit}`);
      const data = await response.json();
      
      setAuthors(data.authors || []); // Fallback to empty array if no authors found
      setTotalPages(data.totalPages || 1); // Fallback to 1 if no total pages found
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page]);

  const handleShowModal = () => {
    if (mode === 'dev') {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    const authorData = { ...formData };

    try {
      const response = await fetch('http://localhost:4000/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(authorData),
      });

      if (response.ok) {
        // Directly fetch the updated authors list
        fetchAuthors(); // Fetch updated authors list
        handleCloseModal();
      } else {
        const error = await response.json();
        console.error('Failed to add author:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAllAuthors = async () => {
    if (window.confirm('Are you sure you want to delete all authors? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:4000/authors', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          setAuthors([]); // Clear the list of authors after deletion
          setTotalPages(1); // Reset the total page count
          setPage(1); // Reset to the first page
        } else {
          const error = await response.json();
          console.error('Failed to delete all authors:', error.message);
        }
      } catch (error) {
        console.error('Error deleting all authors:', error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Container fluid="sm" className='margin'>
      {mode === 'dev' && (
        <div className="mb-4">
          <Button onClick={handleShowModal} variant="primary" className="me-2">
            Add New Author
          </Button>
          <Button onClick={handleDeleteAllAuthors} variant="danger">
            Delete All Authors
          </Button>
        </div>
      )}

      <Row className="blog-author-row">
        {authors.map((author) => (
          <Col sm={6} md={3} key={author._id}>
            <Link to={`/authors/${author._id}`} style={{ textDecoration: 'none' }}>
              <Card className="author-card">
                <Card.Img variant="top" src={author.avatar || 'default-avatar.png'} alt={`${author.name} ${author.surname}`} />
                <Card.Body>
                  <Card.Title>{`${author.name} ${author.surname}`}</Card.Title>
                  <Card.Text>{author.email}</Card.Text>
                  <Card.Text><strong>Birth Date:</strong> {author.birthDate}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="d-flex justify-content-center my-4">
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === page}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
      </Pagination>

      {/* Add Author Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAuthor}>
            <Form.Group controlId="name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author's first name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="surname" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author's last name"
                value={formData.surname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter author's email"
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
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter URL for author's avatar"
                value={formData.avatar}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Author
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BlogAuthorsList;
