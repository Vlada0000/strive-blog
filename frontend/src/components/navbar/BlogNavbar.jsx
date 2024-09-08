import React, { useState, useContext } from "react";
import { Button, Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ModeContext } from "../../context/ModeContext"; 
import logo from "../../assets/logo.png";
import './BlogNavbar.css';

const NavBar = () => {
  const { author, logout } = useContext(AuthContext); 
  const { mode, toggleMode } = useContext(ModeContext); 
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/home">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/home" className="nav-link">Home</Nav.Link>
          <Nav.Link as={Link} to="/authors" className="nav-link">Authors</Nav.Link>

        </Nav>

        <Button as={Link} to="/new" className="blog-navbar-add-button" size="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          New Article
        </Button>

        {author && (
          <NavDropdown
            title={
              <div className="d-inline-block rounded-circle profile-initial">
                {getInitial(author.name)}
              </div>
            }
            id="basic-nav-dropdown"
            align="end"
            show={showDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className="nav-dropdown-menu"
          >
            <NavDropdown.Item as={Link} to="/me" className="nav-dropdown-item">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider className="nav-dropdown-divider" />
            <NavDropdown.Item onClick={handleLogout} className="nav-dropdown-item">
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        )}

       
        <div className="mode-toggle-buttons">
          <Button
            variant={mode === "dev" ? "primary" : "secondary"}
            onClick={toggleMode}
            className="me-2"
          >
            Switch to {mode === "dev" ? "User" : "Dev"} Mode
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
