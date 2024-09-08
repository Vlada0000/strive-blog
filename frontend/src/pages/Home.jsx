import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import BlogPosts from "./BlogPosts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const { author } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (author) {
      // User is authenticated, so we stop loading
      setLoading(false);
    } else {
      // User is not authenticated, redirect to mainpage page
      navigate('/mainpage');
      
    }
  }, [author, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Container fluid="sm">
      <h1 className="blog-main-title pb-0 mb-0">Welcome to the Strive Blog!</h1>
      <BlogPosts />
    </Container>
  );
};

export default Home;
