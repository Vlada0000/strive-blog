import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './NewBlogPost.css'; 

const NewBlogPost = () => {
  const { author } = useContext(AuthContext); // Get author from context
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [readTime, setReadTime] = useState({ value: "", unit: "" });
  const [error, setError] = useState("");
  const [postId, setPostId] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const readTimeValue = parseFloat(readTime.value);
    if (isNaN(readTimeValue)) {
      setError("Please enter a valid number for read time.");
      return;
    }

    const postData = {
      title,
      category,
      content,
      author: author?._id, // Use the author's ID from context
      readTime: {
        value: readTimeValue,
        unit: readTime.unit
      }
    };

    try {
      const response = await fetch('http://localhost:4000/blogposts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Failed to create blog post.');
      }

      const responseBody = await response.json();
      setPostId(responseBody._id);

      if (coverImage) {
        const formData = new FormData();
        formData.append('coverImage', coverImage);

        const uploadResponse = await fetch(`http://localhost:4000/blogposts/${responseBody._id}/cover`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorBody = await uploadResponse.json();
          throw new Error(errorBody.message || 'Error uploading cover image.');
        }
      }

      // Reset form fields after successful submission
      setTitle("");
      setCategory("");
      setContent("");
      setCoverImage(null);
      setReadTime({ value: "", unit: "" });
      setError("");

      // Redirect to home 
      navigate('/home');
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        {error && <p className="text-danger">{error}</p>}
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formTitle">Title</Form.Label>
          <Form.Control
            size="lg"
            id="formTitle"
            placeholder="Enter the title of your blog post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formCategory">Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            id="formCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
            <option value="Category 3">Category 3</option>
            <option value="Category 4">Category 4</option>
            <option value="Category 5">Category 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formCoverImage">Cover Image</Form.Label>
          <Form.Control
            size="lg"
            id="formCoverImage"
            type="file"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formReadTimeValue">Read Time (Value)</Form.Label>
          <Form.Control
            size="lg"
            id="formReadTimeValue"
            placeholder="Enter read time value (e.g., 5)"
            value={readTime.value}
            onChange={(e) => setReadTime({ ...readTime, value: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formReadTimeUnit">Read Time (Unit)</Form.Label>
          <Form.Control
            size="lg"
            id="formReadTimeUnit"
            placeholder="Enter unit of read time (e.g., minutes)"
            value={readTime.unit}
            onChange={(e) => setReadTime({ ...readTime, unit: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="formContent">Blog Content</Form.Label>
          <Form.Control
            id="formContent"
            placeholder="Write your blog content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            as="textarea"
            rows="10"
            required
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button 
            type="reset" 
            size="lg" 
            variant="outline-dark"
            className="me-2"
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
