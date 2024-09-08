import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Login from '../components/blog/register-login/Login';
import Register from '../components/blog/register-login/Register';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterConfirmation, setShowRegisterConfirmation] = useState(false);
  const { handleGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowRegisterConfirmation(false);
  };

  const handleShowLogin = () => setShowLogin(true);
  const handleShowRegister = () => setShowRegister(true);
  
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setShowRegisterConfirmation(true);
  };

  const handleLoginSuccess = () => {
    handleClose();
    navigate('/home');
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h1>Welcome to Our Blog!</h1>
      <Button 
        variant="primary" 
        onClick={handleShowLogin}
        className="mb-2"
      >
        Login
      </Button>
      <Button 
        variant="secondary" 
        onClick={handleShowRegister}
        className="mb-2"
      >
        Register
      </Button>
      <Button 
        variant="danger" 
        onClick={handleGoogleLogin}
        className="mb-2"
      >
        Login with Google
      </Button>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onSuccess={handleLoginSuccess} />
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Register onSuccess={handleRegisterSuccess} />
        </Modal.Body>
      </Modal>

      {/* Registration Confirmation Modal */}
      <Modal show={showRegisterConfirmation} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your registration was successful, and a confirmation email has been sent to you. Would you like to log in now?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              handleShowLogin();
            }}
          >
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MainPage;
