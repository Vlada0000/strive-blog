import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext'; 
import './CommentDetails.css';

const CommentDetails = () => {
    const { id, commentId } = useParams();
    const navigate = useNavigate();
    const { author } = useContext(AuthContext); // Get the user from the authentication context
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}/comments/${commentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comment');
                }
                const data = await response.json();
                setComment(data);
                setContent(data.content);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComment();
    }, [id, commentId]);

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            navigate(`/blogposts/${id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteComment = async () => {
        if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}/comments/${commentId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete comment');
                }

                navigate(`/blogposts/${id}`);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) return <p className="text-center">Loading comment details...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    if (!comment) return <p className="text-center">Comment not found.</p>;

    // Check if the current user is the author of the comment
    const isAuthor = author && comment.author === author.email;

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Card.Title>Comment Details</Card.Title>
                    <Form onSubmit={handleUpdateComment}>
                        <Form.Group controlId="commentContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={!isAuthor} // Disable the textarea if not the author
                            />
                        </Form.Group>
                        {isAuthor && (
                            <>
                                <Button variant="primary" type="submit" className="mt-3">Update Comment</Button>
                                <Button variant="danger" onClick={handleDeleteComment} className="ms-2 mt-3">Delete Comment</Button>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CommentDetails;
