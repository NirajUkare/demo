import connectDB from './db.js';
import Book from './models/Book.js';
import dotenv from 'dotenv';
dotenv.config();

await connectDB();

const books = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    image: "https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL._SX311_BO1,204,203,200_.jpg",
    description: "A journey of self-discovery following a shepherd boy named Santiago."
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 420,
    image: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    description: "A guide on building good habits and breaking bad ones."
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 350,
    image: "https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg",
    description: "Personal finance classic on wealth building and mindset."
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 560,
    image: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg",
    description: "A guide to writing clean, maintainable, and scalable code."
  },
  {
    title: "You Don’t Know JS: Scope & Closures",
    author: "Kyle Simpson",
    price: 299,
    image: "https://m.media-amazon.com/images/I/51cUVaBWXzL.jpg",
    description: "Deep exploration of JavaScript’s scope and closures."
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    price: 399,
    image: "https://m.media-amazon.com/images/I/91asIC1fRwL.jpg",
    description: "A modern introduction to programming using JavaScript."
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 449,
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    description: "Timeless lessons about wealth, greed, and happiness."
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    price: 380,
    image: "https://m.media-amazon.com/images/I/51Zxv5hFKmL.jpg",
    description: "Rules for focused success in a distracted world."
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 240,
    image: "https://m.media-amazon.com/images/I/71UypkUjStL.jpg",
    description: "Classic book on mindset and financial success."
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    price: 699,
    image: "https://m.media-amazon.com/images/I/41as+WafrFL.jpg",
    description: "Tips and practices for becoming an effective developer."
  }
];

const seedBooks = async () => {
  try {
    console.log("Deleting existing books...");
    await Book.deleteMany();

    console.log("Inserting sample books...");
    await Book.insertMany(books);

    console.log("✅ Successfully inserted books into database.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while inserting books:", err);
    process.exit(1);
  }
};

seedBooks();
