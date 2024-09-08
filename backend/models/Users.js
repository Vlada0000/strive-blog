/*import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  name: { 
    type: String, 
    required: true 
  },
  surname: { 
    type: String, 
    required: true 
  },
  birthDate: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    required: false  
  }
}, {
  timestamps: true,
  collection: 'users'
});

const User = model('User', userSchema);

export default User;*/
