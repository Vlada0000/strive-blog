import mongoose from 'mongoose';
const { Schema } = mongoose;


const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }); 


const Comment = mongoose.model('Comment', commentSchema, 'comments'); 

export default Comment;
