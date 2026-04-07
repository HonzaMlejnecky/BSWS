import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsApi, subscriptionsApi } from '../api/generatedClient';
import PageHeader from '../components/UI/PageHeader';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const subscriptions = await subscriptionsApi.getMine();
        const active = (subscriptions || []).some((s) => s.status?.toLowerCase() === 'active');
        if (!active) {
          navigate('/subscription', { replace: true });
          return;
        }

        const list = await projectsApi.getMine();
        if (alive) setProjects(list || []);
      } catch (err) {
        if (alive) setError(err.message || 'Nepodařilo se načíst dashboard');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [navigate]);

  if (loading) return <div className="max-w-7xl mx-auto p-6 text-sm text-gray-500">Načítání dashboardu…</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Dashboard" description="Přehled vašich hostingových projektů" buttonText="Vytvořit projekt" onAction={() => navigate('/projects/new')} />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-600">Zatím nemáte žádný projekt.</div>}
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-lg font-semibold text-gray-900">{project.name}</div>
            <div className="text-sm text-gray-500 mt-1">{project.domain}</div>
            <div className="text-sm text-gray-600 mt-2">Plán: <strong>{project.planName || 'N/A'}</strong></div>
            <span className="inline-block mt-4 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#004CAF]">{project.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
