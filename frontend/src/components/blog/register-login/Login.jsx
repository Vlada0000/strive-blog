import React, { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch( `${process.env.REACT_APP_BACKEND_URL}/login `, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const { token } = await response.json();
        login(token);
        onSuccess();
        navigate('/home'); 
      } else {
        const { message } = await response.json();
        setError(message || 'Login failed. Please try again.'); 
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
