import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../shared/BookCard';

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/books')
      .then(res => setBooks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter(b => {
    const s = (b.title + ' ' + (b.author || '')).toLowerCase();
    return s.includes(q.toLowerCase());
  });

  return (
    <section>
      <div className="catalogue-header container-grid">
        <h2>Books Catalogue</h2>
        <div className="search-row">
          <input className="search" placeholder="Search by title or author" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      {loading && <div className="loading">Loading books...</div>}
      {!loading && filtered.length === 0 && <div className="empty">No books found</div>}
      <div className="grid">
        {filtered.map(b => <BookCard key={b._id} book={b} />)}
      </div>
    </section>
  );
}
