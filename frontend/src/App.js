import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar/BlogNavbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import New from './pages/New';
import BlogAuthorsList from './components/blog/Author/BlogAuthorsList';
import AuthorDetails from './components/blog/Author/AuthorDetails';
import BlogPosts from './pages/BlogPosts';
import BlogPostDetails from './pages/BlogPostDetails';
import UploadAvatar from './components/blog/Uploads/UploadAvatar';
import UploadCover from './components/blog/Uploads/UploadCover';
import CommentDetails from './components/blog/Comments/CommentDetails';
import Register from './components/blog/register-login/Register';
import Login from './components/blog/register-login/Login';
import MainPage from './pages/MainPage';
import UserProfile from './pages/UserProfile';
import TokenHandler from './pages/TokenHandler'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  

  return (
    <Router>
      <AuthProvider>
        <ModeProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/mainPage" />} />
            <Route path="/mainPage" element={<MainPage />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/register" element={<MainPage />} />
            <Route path="/login" element={<MainPage />} />
            <Route path="/me" element={<PrivateRoute element={<UserProfile />} />} />
            <Route path="/new" element={<PrivateRoute element={<New />} />} />
            <Route path="/blogposts" element={<PrivateRoute element={<BlogPosts  />} />} />
            <Route path="/blogposts/:id" element={<PrivateRoute element={<BlogPostDetails />} />} />
            <Route path="/authors" element={<PrivateRoute element={<BlogAuthorsList />} />} />
            <Route path="/authors/:id" element={<PrivateRoute element={<AuthorDetails />} />} />
            <Route path="/authors/:id/avatar" element={<PrivateRoute element={<UploadAvatar />} />} />
            <Route path="/blogposts/:id/cover" element={<PrivateRoute element={<UploadCover />} />} />
            <Route path="/blogPosts/:id/comments/:commentId" element={<PrivateRoute element={<CommentDetails />} />} />
            <Route path="/auth/callback" element={<TokenHandler />} /> {/* Aggiungi questa rotta */}
          </Routes>
          <Footer />
        </ModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
