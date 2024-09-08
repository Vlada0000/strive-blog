import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup, Button, Alert } from 'react-bootstrap';
import CommentForm from './CommentForm'; 
import './Comments.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (!postId) {
            setError('Invalid postId');
            setLoading(false); 
            return;
        }

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:4000/blogposts/${postId}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); 
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = async (newComment) => {
        if (!postId) {
            setError('Invalid postId');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/blogposts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const addedComment = await response.json();
            setComments(prevComments => [...prevComments, addedComment]); 
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading comments...</p>; 
    if (error) return <Alert variant="danger">{error}</Alert>; 

    return (
        <div className="comments-section mt-4">
            <CommentForm postId={postId} onAddComment={handleAddComment} />
            <Card className="mt-4">
                <Card.Header>Comments</Card.Header>
                <ListGroup variant="flush">
                    {comments.length === 0 ? (
                        <ListGroup.Item>No comments yet.</ListGroup.Item>
                    ) : (
                        comments.map(comment => (
                            <ListGroup.Item key={comment._id}>
                                <p>{comment.content}</p>
                                <p><strong>By:</strong> {comment.author}</p>
                                <Link to={`/blogposts/${postId}/comments/${comment._id}`}>
                                    <Button variant="link">View Details</Button>
                                </Link>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>
        </div>
    );
};

export default Comments;
