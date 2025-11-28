import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      if (res.data.userId) {
        alert('Registered successfully');
        navigate('/login');
      } else {
        alert(res.data.msg || 'Registration failed');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create account</h2>
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  );
}
