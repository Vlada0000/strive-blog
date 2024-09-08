import express from 'express';
import { register, login, me, updateProfile, uploadAvatar, deleteProfile} from '../controllers/authController.js';
import authorization from '../middlewares/authorization.js';
import passport from 'passport';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/callback-google', passport.authenticate('google', { session: false }), (req, res) => {
  const { token } = req.user;

  if (token) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`); // Redirect al frontend con il token
  } else {
    res.status(500).json({ error: 'Errore nella generazione del token' });
  }
});


// Endpoint per la registrazione di un nuovo utente
router.post('/register', register);

// Endpoint per il login tradizionale
router.post('/login', login);

// Endpoint per ottenere i dati dell'utente autenticato
router.get('/me', authorization, me);

// Endpoint per aggiornare il profilo dell'autore autenticato
router.put('/me', authorization, updateProfile);

// Endpoint per caricare l'avatar dell'autore autenticato
router.patch('/me/avatar', authorization, upload.single('avatar'), uploadAvatar);

// Endpoint per eliminare il profilo dell'autore autenticato
router.delete('/me', authorization, deleteProfile);


export default router;
