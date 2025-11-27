import express from 'express';
import Book from '../models/Book.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.get('/', async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ msg: 'Not found' });
  res.json(book);
});
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET);
    const b = await Book.create(req.body);
    res.json(b);
  } catch (err) { res.status(401).json({ msg: 'Unauthorized' }); }
});
export default router;
