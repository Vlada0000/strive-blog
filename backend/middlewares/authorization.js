import jwt from 'jsonwebtoken';
import Author from '../models/Authors.js';

export default async (req, res, next) => {
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        
        const author = await Author.findById(payload.authorId); 

        
        if (!author) {
            return res.status(401).json({ error: 'User not found' });
        }

        
        req.loggedAuthor = author;
        console.log('Authenticated user:', author);

       
        next();
    } catch (err) {
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};
