import express from 'express';
import upload from '../config/multerConfig.js';
import {
  getBlogPosts,

  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  deleteAllBlogPosts,
  uploadBlogPostCover
} from '../controllers/blogPostsController.js';

const router = express.Router();

router.get('/', getBlogPosts);

router.get('/:id', getBlogPostById);
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.delete('/', deleteAllBlogPosts);
router.patch('/:id/cover', upload.single('coverImage'), uploadBlogPostCover); 

export default router;
