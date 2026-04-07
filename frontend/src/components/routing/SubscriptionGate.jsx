import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { subscriptionsApi } from '../../api/generatedClient';

function isSubscriptionActive(subscription) {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  if (!subscription.expiresAt) return true;
  return new Date(subscription.expiresAt).getTime() > Date.now();
}

export default function SubscriptionGate({ children }) {
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadSubscriptions = async () => {
      try {
        const data = await subscriptionsApi.getMine();
        if (alive) {
          setSubscriptions(data || []);
        }
      } catch {
        if (alive) {
          setSubscriptions([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadSubscriptions();
    return () => {
      alive = false;
    };
  }, []);

  const hasActiveSubscription = useMemo(
    () => subscriptions.some((subscription) => isSubscriptionActive(subscription)),
    [subscriptions],
  );

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Načítání předplatného…</div>;
  }

  if (!hasActiveSubscription) {
    return <Navigate to="/subscription" replace state={{ from: location }} />;
  }

  return children;
}
