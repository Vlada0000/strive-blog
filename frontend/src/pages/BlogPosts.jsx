import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Pagination, Form } from 'react-bootstrap';
import './BlogPosts.css';


const BlogPost = ({ post }) => {
  const authorEmail = post.author?.email || 'Unknown Author';

  return (
    <div className="blog-post">
      <h2>{post.title}</h2>
      {post.cover && <img src={post.cover} alt={post.title} className="blog-post-cover" />}
      <p><strong>Category:</strong> {post.category}</p>
      <p><strong>Author:</strong> {authorEmail}</p>
      <p><strong>Read Time:</strong> {post.readTime.value} {post.readTime.unit}</p>
      <div className="post-content">
        {post.content}
      </div>
      <Link to={`/blogposts/${post._id}`} className="read-more-link">Read More</Link>
    </div>
  );
};

const BlogPosts = ({ searchQuery, authorId }) => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [localAuthorId, setLocalAuthorId] = useState(authorId || '');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsPerPage = 9;
        const query = new URLSearchParams({ _page: currentPage, _limit: postsPerPage });

        if (localSearchQuery) query.append('title', localSearchQuery);
        if (localAuthorId) query.append('authorId', localAuthorId);

        const url = localAuthorId 
          ? `${process.env.REACT_APP_BACKEND_URL}/blogposts/authors/${localAuthorId}?${query.toString()}`
          : `${process.env.REACT_APP_BACKEND_URL}/blogposts?${query.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts || 0);
        } else {
          throw new Error('Invalid data structure received.');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(`Error fetching posts: ${error.message}`);
      }
    };

    fetchPosts();
  }, [localSearchQuery, localAuthorId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalPosts / 10);

  return (
    <Container className='margin'>
      <Form className="mb-4">
        <Form.Group controlId="searchQuery">
          <Form.Label>Search by Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setCurrentPage(1); // Reset to first page on new search
              }
            }}
          />
        </Form.Group>
      </Form>

      {error && <div className="alert alert-danger">{error}</div>}
      <Row>
        {posts.length > 0 ? (
          posts.map(post => (
            <Col key={post._id} md={4} className="mb-4">
              <BlogPost post={post} />
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>No posts found.</p>
          </Col>
        )}
      </Row>
     
      <Pagination className="justify-content-center">
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default BlogPosts;
