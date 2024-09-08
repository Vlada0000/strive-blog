import express from 'express';
import BlogPost from '../models/BlogPosts.js';
import Author from '../models/Authors.js';

import upload from '../config/multerConfig.js';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  deleteAllAuthors,
  uploadAuthorAvatar,
  GetBlogPostsByAuthor
} from '../controllers/authorsController.js';

const router = express.Router();

// Rotte per la gestione degli autori
router.get('/', getAuthors); // Ottieni tutti gli autori con paginazione
router.get('/:id', getAuthorById); // Ottieni un autore per ID
router.get('/:id/blogPosts', GetBlogPostsByAuthor); // Ottieni tutti i post di uno specifico autore
router.post('/', createAuthor); // Crea un nuovo autore
router.put('/:id', updateAuthor); // Aggiorna un autore esistente
router.delete('/:id', deleteAuthor); // Elimina un autore
router.delete('/', deleteAllAuthors); // Elimina tutti gli autori
router.patch('/:id/avatar', upload.single('avatar'), uploadAuthorAvatar); // Carica l'avatar di un autore

export default router;
