import jwt from 'jsonwebtoken';
import Author from '../models/Authors.js';

export default async (req, res, next) => {
    // Verifica se l'header Authorization è presente e ha il formato corretto
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        // Verifica e decodifica il token JWT
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Recupera i dati dell'utente dal database
        const author = await Author.findById(payload.authorId); //.select('-password');

        // Verifica se l'autore esiste
        if (!author) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Aggiunge l'utente autenticato all'oggetto `req`
        req.loggedAuthor = author;
        console.log('Authenticated user:', author);

        // Passa al prossimo middleware
        next();
    } catch (err) {
        // Gestione degli errori del token
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};
