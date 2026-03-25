import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansApi, subscriptionsApi } from '../api/generatedClient';
import PageHeader from '../components/UI/PageHeader';

function isActive(sub) {
  return sub?.status?.toLowerCase() === 'active';
}

export default function PlanSelectionPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [planData, subsData] = await Promise.all([plansApi.getAll(), subscriptionsApi.getMine()]);
      setPlans(planData || []);
      setSubscriptions(subsData || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Nepodařilo se načíst plány');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const activeSubscription = useMemo(() => subscriptions.find((s) => isActive(s)), [subscriptions]);

  useEffect(() => {
    if (activeSubscription) navigate('/dashboard', { replace: true });
  }, [activeSubscription, navigate]);

  const selectPlan = async (planId) => {
    try {
      await subscriptionsApi.selectPlan(planId);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Výběr plánu selhal');
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto p-6 text-sm text-gray-500">Načítání plánů…</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Výběr hostingového plánu" description="Vyberte plán, který odpovídá rozsahu vašich webových projektů." />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#004CAF]">
            <h2 className="text-2xl font-bold text-[#004CAF]">{plan.name}</h2>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• Diskový prostor: {plan.diskSpaceMb} MB</li>
              <li>• Max. projektů: {plan.maxDomains}</li>
              <li>• FTP účty: {plan.maxFtpAccounts}</li>
              <li>• E-mail účty: {plan.maxEmailAccounts}</li>
            </ul>
            <p className="mt-6 text-sm text-gray-500">{Number(plan.priceMonthly || 0).toFixed(0)} Kč / měsíc</p>
            <button onClick={() => selectPlan(plan.id)} className="w-full mt-4 bg-[#004CAF] text-white py-3 rounded-xl font-semibold hover:bg-[#003b8a]">Aktivovat plán</button>
          </div>
        ))}
      </div>
    </div>
  );
}
