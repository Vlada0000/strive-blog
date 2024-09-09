import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Author from '../models/Authors.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}:${process.env.PORT}/auth/callback-google`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile); 

    
    let user = await Author.findOne({ googleId: profile.id });

    
    if (!user) {
      user = await Author.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });
    }

    
    const token = jwt.sign({ authorId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated Token:', token); 

    
    return done(null, { token });
  } catch (error) {
    console.error('Error in GoogleStrategy:', error);
    return done(error, null);
  }
}));
