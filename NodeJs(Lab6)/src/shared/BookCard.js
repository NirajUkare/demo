export default function BookCard({ book }) {
  return (
    <article className="card">
      <div className="card-media">
        <img src={book.image || 'https://via.placeholder.com/300x400?text=No+Image'} alt={book.title} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        <p className="card-desc">{book.description?.slice(0, 120)}</p>
        <div className="card-footer">
          <div className="price">₹{book.price?.toFixed(2)}</div>
          <button className="btn small">Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
