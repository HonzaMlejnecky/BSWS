import { useCallback, useEffect, useState } from 'react';
import { projectsApi } from '../api/generatedClient';
import { useAuth } from '../context/AuthContext';

function mapStatus(statusRaw) {
  const status = (statusRaw || '').toLowerCase();
  if (status === 'published') return 'published';
  if (status === 'failed') return 'failed';
  return 'draft';
}

function mapProject(project) {
  const publicationStatus = mapStatus(project.publicationStatus);
  return {
    id: project.id,
    name: project.domain,
    domain: project.domain,
    uploadPath: project.documentRoot,
    type: project.runtime,
    publicationStatus,
    publicationError: project.provisioningError || '',
    url: `http://${project.domain}`,
    gitUrl: project.runtime === 'static' ? 'Git/static deploy' : '',
    logs: [
      `Runtime: ${project.runtime}`,
      `Doc root: ${project.documentRoot}`,
      `Status: ${publicationStatus}`,
      project.provisioningError ? `Provisioning error: ${project.provisioningError}` : 'Provisioning error: none',
    ],
  };
}

export default function useProjects() {
  const { userId } = useAuth();
  const [projects, setProjects] = useState([]);

  const reload = useCallback(async () => {
    if (!userId) return [];
    const list = await projectsApi.getMine();
    return (list || []).map(mapProject);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    reload().then((next) => mounted && setProjects(next)).catch(() => mounted && setProjects([]));
    return () => { mounted = false; };
  }, [reload]);

  const addProject = async (project) => {
    await projectsApi.create({
      domain: `${project.name.toLowerCase().replace(/\s+/g, '-')}.local`,
      runtime: project.type === 'ftp' ? 'php' : 'static',
    });
    setProjects(await reload());
  };

  const deleteProject = async (id) => {
    await projectsApi.remove(id);
    setProjects(await reload());
  };

  const redeployProject = async (id) => {
    try {
      await projectsApi.redeploy(id);
    } catch {
      await projectsApi.publish(id);
    }
    setProjects(await reload());
  };

  return { projects, addProject, deleteProject, redeployProject };
}
