import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; 

const UserProfile = () => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not authenticated. Please log in to access this page.');
          navigate('/mainPage'); // Redirect to login page if not authenticated
          return;
        }

        const response = await fetch('http://localhost:4000/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Invalid or expired token. Please log in again.');
            localStorage.removeItem('token'); // Remove token if invalid
            navigate('/mainPage'); // Redirect to login page
          } else {
            throw new Error('Unable to load user data. Please try again later.');
          }
          return;
        }

        const data = await response.json();
        setAuthor(data);
        setName(data.name);
        setSurname(data.surname);
        setBirthDate(data.birthDate);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/mainPage');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch('http://localhost:4000/me/avatar', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error uploading avatar. Please try again later.');
        }

        const { avatar: avatarUrl } = await response.json();
        setAuthor((prev) => ({ ...prev, avatar: avatarUrl }));
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('http://localhost:4000/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          surname,
          birthDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating profile. Please try again later.');
      }

      const updatedAuthor = await response.json();
      setAuthor(updatedAuthor);
      setEditMode(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleProfileDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:4000/me', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error deleting profile. Please try again later.');
        }

        localStorage.removeItem('token');
        navigate('/mainPage');
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="user-profile-container">
      <Card>
        <Card.Header as="h3">Your Profile</Card.Header>
        <Card.Body>
          <div className="profile-avatar">
            {author?.avatar ? (
              <img src={author.avatar} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {author?.name ? author.name.charAt(0) : '?'}
              </div>
            )}
            <Form.Group className="mt-3">
              <Form.Label htmlFor="avatarUpload">Upload New Avatar</Form.Label>
              <Form.Control
                id="avatarUpload"
                type="file"
                onChange={handleAvatarUpload}
              />
            </Form.Group>
          </div>
          {editMode ? (
            <div>
              <Form.Group className="mt-3">
                <Form.Label htmlFor="name">First Name</Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label htmlFor="surname">Last Name</Form.Label>
                <Form.Control
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label htmlFor="birthDate">Date of Birth</Form.Label>
                <Form.Control
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Form.Group>
              <Button className="mt-3" onClick={handleProfileUpdate}>
                Save Changes
              </Button>
            </div>
          ) : (
            <div>
              <Card.Text>
                <strong>First Name:</strong> {author?.name}
              </Card.Text>
              <Card.Text>
                <strong>Last Name:</strong> {author?.surname}
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> {author?.email}
              </Card.Text>
              <Card.Text>
                <strong>Date of Birth:</strong> {author?.birthDate}
              </Card.Text>
              <Card.Text>
                <strong>Registered On:</strong> {author?.verifiedAt ? new Date(author.verifiedAt).toLocaleDateString() : 'Not Verified'}
              </Card.Text>
              <Button className="mt-3" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
              <Button className="mt-3" variant="danger" onClick={handleProfileDelete}>
                Delete Profile
              </Button>
            </div>
          )}
          <Button className="btn-logout mt-3" onClick={handleLogout}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
