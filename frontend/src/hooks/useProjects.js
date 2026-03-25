import { useEffect, useState } from 'react';
import { ordersApi } from '../api/generatedClient';
import { useAuth } from '../context/AuthContext';

export default function useProjects() {
  const { userId } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let mounted = true;
    ordersApi.getByUser(userId)
      .then((orders) => {
        if (!mounted) return;
        const mapped = (orders || []).map((order) => ({
          id: order.id,
          name: order.orderNumber || `Subscription ${order.id}`,
          type: 'hosting-plan',
          status: order.status || 'active',
          url: '#',
          gitUrl: '',
          logs: [`Plan ${order.planId}`, `Expires: ${order.expiresAt || '-'}`],
        }));
        setProjects(mapped);
      })
      .catch(() => setProjects([]));

    return () => {
      mounted = false;
    };
  }, [userId]);

  const addProject = (project) => setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
  const deleteProject = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));
  const redeployProject = (id) => setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'updating' } : p)));

  return { projects, addProject, deleteProject, redeployProject };
}
