import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  price: Number,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', bookSchema);
export default Book;
