import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import './BlogPosts.css'; 

const BlogPost = ({ post }) => {
  const { author } = useContext(AuthContext); 


  const authorEmail = post.author?.email || author?.email || 'Email autore sconosciuta';

  return (
    <div className="blog-post">
      <h2>{post.title || 'Nessun Titolo'}</h2>
      {post.cover ? (
        <img src={post.cover} alt={post.title || 'Nessun Titolo'} className="blog-post-cover" />
      ) : (
        <div className="no-cover">Nessuna immagine di copertura</div>
      )}
      <p><strong>Categoria:</strong> {post.category || 'Senza categoria'}</p>
      <p><strong>Autore:</strong> {authorEmail}</p> 
      <p><strong>Tempo di Lettura:</strong> {post.readTime?.value || 'Sconosciuto'} {post.readTime?.unit || ''}</p>
      <div className="post-content">
        {post.content || 'Nessun contenuto disponibile'}
      </div>
      <Link to={`/blogposts/${post._id}`} className="read-more-link">Leggi di più</Link>
    </div>
  );
};

export default BlogPost;
