import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Hesla se neshodují.');
      return;
    }

    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, username: form.email.split('@')[0] });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Registrace selhala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-14 mb-20 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <h1 className="text-3xl font-bold text-[#004CAF] mb-2">Vytvořit účet</h1>
      <p className="text-sm text-gray-500 mb-8">Registrace je okamžitě aktivní, bez email verifikace.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" type="password" placeholder="Heslo (min. 8 znaků)" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" type="password" placeholder="Potvrzení hesla" required value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-[#004CAF] text-white py-3 rounded-xl font-bold hover:bg-[#003b8a] transition disabled:opacity-60">{loading ? 'Vytváření…' : 'Vytvořit účet'}</button>
      </form>
      <p className="mt-5 text-sm text-gray-600">Máte účet? <Link to="/login" className="text-[#004CAF] font-semibold">Přihlášení</Link></p>
    </div>
  );
}
