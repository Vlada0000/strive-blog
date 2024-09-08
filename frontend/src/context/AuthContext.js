import React, { createContext, useState, useEffect, useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [author, setAuthor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    try {
      const response = await fetch('http://localhost:4000/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthor(data);
        navigate('/home');
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setAuthor(null);
    }
  };

  const logout = () => {
    setAuthor(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/mainPage');
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const fetchAuthor = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch('http://localhost:4000/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setAuthor(data);
              setIsAuthenticated(true);
            } else {
              throw new Error('Failed to fetch user data');
            }
          } catch (error) {
            console.error('Fetch user error:', error);
            setIsAuthenticated(false);
            setAuthor(null);
            navigate('/mainPage');
          }
        } else {
          setIsAuthenticated(false);
          setAuthor(null);
          navigate('/mainPage');
        }
        setLoading(false);
      };

      fetchAuthor();
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ author, setAuthor, logout, handleGoogleLogin, login }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
