import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home');
    } else {
      navigate('/mainPage');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default TokenHandler;
