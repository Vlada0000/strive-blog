import mongoose from 'mongoose';
import Author from './Authors.js';
const { Schema } = mongoose;

const BlogPostSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  content: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] 

});


const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
