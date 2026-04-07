import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-14 mb-20 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <h1 className="text-3xl font-bold text-[#004CAF] mb-2">Vítejte zpět</h1>
      <p className="text-sm text-gray-500 mb-8">Přihlaste se do hostingového centra.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-[#004CAF] text-white py-3 rounded-xl font-bold hover:bg-[#003b8a] transition disabled:opacity-60">{loading ? 'Přihlašování…' : 'Přihlásit se'}</button>
      </form>
      <p className="mt-5 text-sm text-gray-600">Nemáte účet? <Link to="/register" className="text-[#004CAF] font-semibold">Registrace</Link></p>
    </div>
  );
}
