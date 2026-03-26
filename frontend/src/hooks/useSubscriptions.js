import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersApi, plansApi } from '../api/generatedClient';
import { useAuth } from '../context/AuthContext';

export default function useSubscriptions() {
  const { setUserId } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansData, subsData] = await Promise.all([plansApi.getAll(), ordersApi.getMine()]);
      setPlans(plansData || []);
      setSubscriptions(subsData || []);
      if (subsData?.[0]?.userId) setUserId(subsData[0].userId);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [setUserId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const currentSubscription = useMemo(
    () => [...subscriptions].sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0))[0] || null,
    [subscriptions],
  );

  const currentPlan = useMemo(
    () => plans.find((p) => p.id === currentSubscription?.planId) || null,
    [plans, currentSubscription],
  );

  const selectPlan = async (planId) => {
    await ordersApi.create(planId);
    await reload();
  };

  return { plans, subscriptions, currentSubscription, currentPlan, loading, error, reload, selectPlan };
}
