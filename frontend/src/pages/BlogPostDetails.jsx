import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from '../components/blog/Comments/Comments';
import UploadCover from '../components/blog/Uploads/UploadCover';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Button, Form, Modal } from 'react-bootstrap';
import './BlogPostDetails.css';

const BlogPostDetails = () => {
    const { id } = useParams();
    const { author: currentUser } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({ title: '', category: '', content: '' });

   
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}`);
                if (!response.ok) {
                    throw new Error('Unable to fetch post.');
                }
                const data = await response.json();
                setPost(data);
                setUpdatedPost({ title: data.title, category: data.category, content: data.content });
            } catch (error) {
                setError('Error fetching post: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

   
    const handleCoverUploaded = (coverImageUrl) => {
        setPost(prevPost => ({
            ...prevPost,
            cover: coverImageUrl
        }));
    };

    const handleEditPost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...updatedPost
                }),
            });

            if (response.ok) {
                const updatedData = await response.json();

               
                setPost(prevPost => ({
                    ...prevPost,
                    title: updatedData.title,
                    category: updatedData.category,
                    content: updatedData.content
                }));

                setEditMode(false); 
            } else {
                const responseBody = await response.json();
                setError(`Update failed: ${responseBody.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleDeletePost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blogposts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                navigate('/blogposts'); 
            } else {
                const responseBody = await response.json();
                setError(`Deletion failed: ${responseBody.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!post) return <p>Post not found.</p>;

    const canEdit = currentUser?.email === post.author?.email;

    return (
        <Container fluid="sm" className='mt-5'>
            <Row className="blog-post-details">
                <h2>{post.title || 'No Title'}</h2>
                {post.cover ? (
                    <img src={post.cover} alt={post.title || 'No Title'} className="blog-post-cover" />
                ) : (
                    <div className="no-cover">No cover image</div>
                )}
                <p><strong>Category:</strong> {post.category || 'No category'}</p>
                <p><strong>Author:</strong> {post.author?.email || 'Unknown author'}</p>
                <p><strong>Read Time:</strong> {post.readTime?.value || 'Unknown'} {post.readTime?.unit || ''}</p>
                <div className="post-content">
                    {post.content || 'No content available'}
                </div>

              
                <div className="comments-section mt-5">
                    <h3>Comments</h3>
                    <Comments postId={id} />
                </div>

                {canEdit && (
                    <div className="mt-3">
                        <Button onClick={() => setEditMode(true)} variant="warning">Edit Post</Button>
                        <Button onClick={handleDeletePost} variant="danger" className="ms-2">Delete Post</Button>
                    </div>
                )}
            </Row>

            {/* Edit Post Modal */}
            <Modal show={editMode} onHide={() => setEditMode(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedPost.title}
                                onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategory" className="mt-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedPost.category}
                                onChange={(e) => setUpdatedPost({ ...updatedPost, category: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={updatedPost.content}
                                onChange={(e) => setUpdatedPost({ ...updatedPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                    <UploadCover 
                        postId={id}
                        onCoverUploaded={handleCoverUploaded}
                    />
                    <Button onClick={handleEditPost} className="mt-3" variant="primary">Save Changes</Button>
                    <Button onClick={() => setEditMode(false)} className="ms-2 mt-3" variant="secondary">Cancel</Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default BlogPostDetails;
