import BlogPost from '../models/BlogPosts.js';
import Author from '../models/Authors.js';
import { sendNewPostNotification } from '../services/emailService.js';
// Ottieni tutti i blog post

export const getBlogPosts = async (req, res) => {
  try {
    const { _page = 1, _limit = 10, title, authorId } = req.query;
    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (authorId) query.authorId = authorId;

    const posts = await BlogPost.find(query)
      .skip((_page - 1) * _limit)
      .limit(Number(_limit))
      .populate('author', 'email') 
      .exec();

    const totalPosts = await BlogPost.countDocuments(query);
    res.json({ posts, totalPosts });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei post' });
  }
};



// Ottieni tutti i post di uno specifico autore
export const getBlogPostsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    // Parametri di paginazione con valori predefiniti e gestione degli errori
    const _page = parseInt(req.query._page) || 1;
    const _limit = parseInt(req.query._limit) || 10;
    const skip = (_page - 1) * _limit;

    // Conta il totale dei post per l'autore specificato
    const totalPosts = await BlogPost.countDocuments({ author: authorId });

    // Recupera i post con paginazione e, se necessario, popola i dettagli dell'autore
    const posts = await BlogPost.find({ author: authorId })
      .skip(skip)
      .limit(_limit)
      .populate('author', 'email name'); 

    // Risposta JSON con paginazione e informazioni sui post
    res.json({
      totalPosts: totalPosts,
      totalPages: Math.ceil(totalPosts / _limit),
      currentPage: _page,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await BlogPost.findById(postId).populate('author', 'email');
    
    console.log('Post recuperato:', post);

    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.json(post);
  } catch (error) {
    console.error('Errore durante il recupero del post:', error);
    res.status(500).json({ message: error.message });
  }
};


export const createBlogPost = async (req, res) => {
  try {
    const { category, title, cover, readTime, author, content, comments } = req.body;

    // Crea un nuovo post
    const newPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author,
      content,
      comments
    });

    // Salva il post
    const savedPost = await newPost.save();

    // Trova l'autore del post
    const authorData = await Author.findById(author);

    if (!authorData) {
      throw new Error('Autore non trovato');
    }

    // Invia la notifica all'autore
    await sendNewPostNotification(authorData.email, authorData.name, savedPost.title);

    // Rispondi con successo
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Errore nella creazione del post:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (post) res.json(post);
    else res.status(404).send('Post not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (post) res.status(204).send();
    else res.status(404).send('Post not found');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funzione per cancellare tutti i blog posts
export const deleteAllBlogPosts = async (req, res) => {
  try {
    await BlogPost.deleteMany({}); // Cancella tutti i documenti nella collezione BlogPost
    res.json({ message: 'Tutti i blog posts sono stati cancellati' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};

export const uploadBlogPostCover = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    // Verifica che il file sia stato caricato
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    // Aggiorna la copertina del post
    post.cover = req.file.path;
    await post.save();

    res.json({ message: 'Cover caricata con successo', cover: post.cover });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};