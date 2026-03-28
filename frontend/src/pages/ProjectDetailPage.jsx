import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsApi } from '../api/generatedClient';
import PageHeader from '../components/UI/PageHeader';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    projectsApi.getById(projectId)
      .then((data) => alive && setProject(data))
      .catch((err) => alive && setError(err.message || 'Nepodařilo se načíst detail projektu'));
    return () => { alive = false; };
  }, [projectId]);

  if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600 text-sm">{error}</div>;
  if (!project) return <div className="max-w-5xl mx-auto p-6 text-sm text-gray-500">Načítání detailu projektu…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <PageHeader title={project.name} description={`Detail projektu pro doménu ${project.domain}`} />

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p><strong>Doména:</strong> {project.domain}</p>
        <p><strong>Stav projektu:</strong> <span className="text-[#004CAF] font-semibold">{project.status}</span></p>
        {project.provisioningError && <p className="text-red-600 text-sm mt-2">Provisioning chyba: {project.provisioningError}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">FTP přístupy</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <p><strong>FTP host:</strong> {project.ftpHost}</p>
          <p><strong>FTP port:</strong> {project.ftpPort}</p>
          <p><strong>FTP username:</strong> {project.ftpUsername}</p>
          <p><strong>FTP heslo:</strong> {project.ftpPassword || 'Z bezpečnostních důvodů nelze zobrazit.'}</p>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Nahrajte přes FTP soubor <code>index.html</code> do rootu projektu:
          <br />
          <code>{project.webrootPath}</code>
        </p>
      </div>

      <div className="bg-[#F5F9FF] rounded-2xl border border-blue-100 p-6">
        <h2 className="text-xl font-semibold mb-3 text-[#004CAF]">Jak otestovat web</h2>
        <ol className="text-sm list-decimal pl-5 space-y-2">
          <li>Přidejte <code>{project.domain}</code> do <code>/etc/hosts</code> (na IP virtuálního serveru).</li>
          <li>Uploadněte vlastní <code>index.html</code> přes FTP.</li>
          <li>Otevřete doménu v prohlížeči a ověřte, že je zobrazen váš obsah.</li>
        </ol>
      </div>

      <Link to="/dashboard" className="inline-block text-[#004CAF] font-medium">← Zpět na dashboard</Link>
    </div>
  );
}
