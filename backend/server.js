import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import jwt from 'jsonwebtoken';  
import './config/passportConfig.js'; 
import authorsRouter from './routes/authorsRoutes.js';
import blogPostsRouter from './routes/blogPostsRoutes.js';
import commentsRouter from './routes/commentsRoutes.js';
import Author from './models/Authors.js';
import upload from './config/multerConfig.js'; 
import morgan from 'morgan';
import helmet from 'helmet';
import { register } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

const server = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

server.use(morgan('dev'));
server.use(helmet());
server.use(cors({ origin: 'http://localhost:3000', credentials: true }));
server.use(express.json());
server.use(passport.initialize());

// Recupera le credenziali dal file .env
const uri = process.env.MONGO_URI;


mongoose
  .connect(uri)
  .then(() => console.log("Connesso a MongoDB"))
 /* .then(async () => {
    console.log("Connesso a MongoDB");

    // Gestione degli indici
    try {
      // Rimuovi l'indice esistente su googleId
      await Author.collection.dropIndex('googleId_1');
      console.log('Indice googleId_1 rimosso');

      // Crea un nuovo indice unico con un filtro parziale
      await Author.collection.createIndex(
        { googleId: 1 },
        { unique: true, partialFilterExpression: { googleId: { $ne: null } } }
      );
      console.log('Indice googleId_1 creato con filtro parziale');
    } catch (error) {
      console.error('Errore nella gestione degli indici:', error);
    }
  })*/
  .catch((err) => console.error("Errore di connessione a MongoDB: ", err));


server.post('/register', upload.single('avatar'), register);
server.use('/authors', authorsRouter);
server.use('/blogposts', blogPostsRouter);
server.use('/blogPosts/:id/comments', commentsRouter);
server.use('/', authRoutes);

server.listen(port, () => {
  console.log(`Server in esecuzione su http://${host}:${port}`);
});
