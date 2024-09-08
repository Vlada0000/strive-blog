/*import mongoose from 'mongoose';
import User from './path-to-user-model';
import Author from './path-to-author-model';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;


mongoose
  .connect(uri)
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore di connessione a MongoDB: ", err));

const migrateUsersToAuthors = async () => {
  try {
    const users = await User.find({});
    const authorPromises = users.map(user => {
      const author = new Author({
        email: user.email,
        password: user.password,
        googleId: user.googleId,
        name: user.name,
        surname: user.surname,
        birthDate: user.birthDate,
        avatar: user.avatar
      });
      return author.save();
    });

    await Promise.all(authorPromises);
    console.log('Data migration completed successfully.');
    
  
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.disconnect();
  }
};

migrateUsersToAuthors();*/
