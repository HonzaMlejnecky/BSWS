import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsApi, subscriptionsApi } from '../api/generatedClient';
import PageHeader from '../components/UI/PageHeader';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    subscriptionsApi.getMine().then((subs) => {
      const active = (subs || []).some((s) => s.status?.toLowerCase() === 'active');
      if (!active) navigate('/subscription', { replace: true });
    }).catch(() => navigate('/subscription', { replace: true }));
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await projectsApi.create({ name, domain });
      navigate(`/projects/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Vytvoření projektu selhalo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link to="/projects" className="inline-flex items-center mb-4 text-[#004CAF] font-medium hover:underline">← Zpět na projekty</Link>
      <PageHeader title="Vytvořit projekt" description="Zadejte název projektu a doménu/hostname. Systém spustí provisioning." />
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Název projektu" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Doména (např. demo-1.localhost)" value={domain} onChange={(e) => setDomain(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="bg-[#004CAF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#003b8a] disabled:opacity-60">{loading ? 'Vytváření…' : 'Vytvořit projekt'}</button>
        </form>
      </div>
    </div>
  );
}
