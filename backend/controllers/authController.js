import Author from '../models/Authors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../services/emailService.js';

export const register = async (req, res) => {
    try {
        const { email, password, name, surname, birthDate, googleId } = req.body; 
        const avatar = req.file ? req.file.path : null; 

        // Verifica se l'email è già in uso
        const existingAuthor = await Author.findOne({ email: email.toLowerCase().trim() });
        if (existingAuthor) {
            return res.status(409).json({ error: 'Email già in uso' });
        }

       
        if (!name || !surname || !birthDate || !password) {
            return res.status(400).json({ error: 'Nome, cognome, data di nascita e password sono obbligatori' });
        }

        // Cripta la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo autore
        const newAuthorData = {
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            name,
            surname,
            birthDate,
            avatar, // Salva l'URL dell'avatar
        };

        if (googleId) newAuthorData.googleId = googleId; // Aggiungi googleId solo se è fornito

        const newAuthor = new Author(newAuthorData);

        // Salva l'autore
        const authorCreated = await newAuthor.save();

        // Invia l'email di benvenuto
        try {
            await sendWelcomeEmail(authorCreated.email, authorCreated.name);
        } catch (emailErr) {
            console.error('Errore nell\'invio dell\'email:', emailErr);
            return res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
        }

        // Rispondi al frontend con un messaggio di successo e un indicatore che l'email è stata inviata
        res.status(201).json({ 
            message: 'Registrazione avvenuta con successo!',
            emailSent: true
        });
    } catch (err) {
        console.error('Errore durante la registrazione:', err);
        res.status(500).json({ error: 'Errore nel salvataggio dell\'autore' });
    }
};



// Funzione di login dell'autore
export const login = async (req, res) => {
    try {
        const author = await Author.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!author) {
            return res.status(401).json({ error: 'Credenziali errate' });
        }

        const isMatch = await bcrypt.compare(req.body.password, author.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenziali errate' });
        }

        const token = jwt.sign(
            { authorId: author._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante il login' });
    }
};

// Funzione per ottenere i dati dell'autore autenticato
export const me = (req, res) => {
    if (!req.loggedAuthor) {
        return res.status(401).json({ error: 'Autore non autenticato' });
    }
    res.json(req.loggedAuthor);
};
// Funzione per aggiornare il profilo dell'autore
export const updateProfile = async (req, res) => {
    try {
        const { name, surname, birthDate } = req.body;

        const updatedAuthor = await Author.findByIdAndUpdate(
            req.loggedAuthor._id,
            { name, surname, birthDate },
            { new: true }
        );
        if (updatedAuthor) {
            res.json(updatedAuthor);
        } else {
            res.status(404).json({ error: 'Autore non trovato' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Errore nella richiesta: ' + err.message });
    }
};

// Funzione per caricare l'avatar dell'autore
export const uploadAvatar = async (req, res) => {
    try {
        const author = await Author.findById(req.loggedAuthor._id);
        if (!author) {
            return res.status(404).json({ error: 'Autore non trovato' });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'Nessun file caricato' });
        }

        author.avatar = req.file.path;
        await author.save();

        res.json({ message: 'Avatar caricato con successo', avatar: author.avatar });
    } catch (err) {
        res.status(500).json({ error: 'Errore del server: ' + err.message });
    }
};

// Funzione per eliminare il profilo dell'autore
export const deleteProfile = async (req, res) => {
    try {
        const deletedAuthor = await Author.findByIdAndDelete(req.loggedAuthor._id);
        if (deletedAuthor) {
            res.json({ message: 'Profilo dell\'autore eliminato con successo' });
        } else {
            res.status(404).json({ error: 'Autore non trovato' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Errore del server: ' + err.message });
    }
};