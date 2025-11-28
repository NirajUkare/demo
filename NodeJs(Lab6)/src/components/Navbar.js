import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function Navbar() {
  const [name, setName] = useState(localStorage.getItem('name') || null);
  const navigate = useNavigate();
  useEffect(() => {
    const onStorage = () => setName(localStorage.getItem('name'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setName(null);
    navigate('/');
  };
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">BookStore</Link>
      </div>
      <div className="nav-right">
        <Link to="/catalogue" className="nav-link">Catalogue</Link>
        {!name && <Link to="/login" className="nav-link">Login</Link>}
        {!name && <Link to="/register" className="nav-link cta">Register</Link>}
        {name && <span className="nav-user">Hi, {name}</span>}
        {name && <button className="nav-logout" onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}
