import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('name', res.data.name || '');
        navigate('/');
      } else {
        alert(res.data.msg || 'Login failed');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Login</h2>
        <input required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}
