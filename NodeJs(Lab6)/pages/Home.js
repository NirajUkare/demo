import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../shared/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/books')
      .then(res => setBooks(res.data || []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const topPicks = books.slice(0, 3);
  const bestsellers = books.slice(3, 7);
  const newReleases = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div className="hero-inner container-grid">
          <div className="hero-text">
            <h1>Find your next great read</h1>
            <p>Explore bestsellers, classics and new releases. Fast delivery, secure checkout.</p>
            <div className="hero-actions">
              <Link to="/catalogue" className="btn">Browse Catalogue</Link>
              <a href="#deals" className="btn ghost">Today's Deals</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a4b1b1a0c2d9f1b9f5b3c8f6a9c4b2a" alt="books" />
          </div>
        </div>
      </section>

      <main className="container">
        <section className="section">
          <div className="section-header">
            <h2>Top Picks</h2>
            <Link to="/catalogue" className="view-all">View all</Link>
          </div>
          {loading && <div className="loading">Loading...</div>}
          {!loading && topPicks.length === 0 && <div className="empty">No top picks yet</div>}
          <div className="row-cards">
            {topPicks.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Bestsellers</h2>
            <Link to="/catalogue" className="view-all">See more</Link>
          </div>
          <div className="row-cards">
            {bestsellers.length ? bestsellers.map(b => <BookCard key={b._id} book={b} />) : <div className="empty">No bestsellers yet</div>}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>New Releases</h2>
            <Link to="/catalogue" className="view-all">New in store</Link>
          </div>
          <div className="row-cards">
            {newReleases.length ? newReleases.map(b => <BookCard key={b._id} book={b} />) : <div className="empty">No new releases</div>}
          </div>
        </section>
      </main>
    </div>
  );
}
