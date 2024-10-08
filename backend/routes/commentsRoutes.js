
import express from 'express';
import {
  getCommentsByPostId,
  getCommentById,
  addCommentToPost,
  updateComment,
  deleteComment
} from '../controllers/commentsController.js';

const router = express.Router({ mergeParams: true }); 

router.get('/', getCommentsByPostId);
router.get('/:commentId', getCommentById);
router.post('/', addCommentToPost);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router; 
