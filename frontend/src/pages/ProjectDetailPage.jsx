import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectsApi } from '../api/generatedClient';
import PageHeader from '../components/UI/PageHeader';

function formatSize(value) {
  if (value == null || value < 0) return 'neznámá velikost';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadProject = async () => {
    const data = await projectsApi.getById(projectId);
    setProject(data);
  };

  const loadFiles = async () => {
    const list = await projectsApi.listFiles(projectId);
    setFiles(list || []);
  };

  useEffect(() => {
    let alive = true;
    Promise.all([projectsApi.getById(projectId), projectsApi.listFiles(projectId)])
      .then(([projectData, filesData]) => {
        if (!alive) return;
        setProject(projectData);
        setFiles(filesData || []);
      })
      .catch((err) => alive && setError(err.message || 'Nepodařilo se načíst detail projektu'));
    return () => { alive = false; };
  }, [projectId]);

  const appUploadTarget = useMemo(() => project?.webrootPath || '', [project?.webrootPath]);

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Vyberte soubor pro upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    try {
      await projectsApi.uploadFile(projectId, uploadFile);
      setUploadSuccess(`Soubor ${uploadFile.name} byl nahrán.`);
      setUploadFile(null);
      await Promise.all([loadProject(), loadFiles()]);
    } catch (err) {
      setUploadError(err.message || 'Upload souboru selhal');
    } finally {
      setUploading(false);
    }
  };

  if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600 text-sm">{error}</div>;
  if (!project) return <div className="max-w-5xl mx-auto p-6 text-sm text-gray-500">Načítání detailu projektu…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <PageHeader title={project.name} description={`Detail projektu pro doménu ${project.domain}`} />

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p><strong>Doména:</strong> {project.domain}</p>
        <p><strong>Hostingový plán:</strong> {project.planName || 'Není přiřazen'}</p>
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
          FTP upload cíluje do rootu projektu: <code>{project.webrootPath}</code>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Upload přes aplikaci</h2>
        <p className="text-sm text-gray-600 mb-4">
          Nahrajte soubor přímo do webrootu projektu (<code>{appUploadTarget}</code>). Typicky nahrajte <code>index.html</code>.
        </p>

        <form onSubmit={submitUpload} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#004CAF]"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-[#004CAF] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#003b8a] disabled:opacity-60"
          >
            {uploading ? 'Nahrávání…' : 'Nahrát soubor'}
          </button>
        </form>

        {uploadError && <p className="text-sm text-red-600 mt-3">{uploadError}</p>}
        {uploadSuccess && <p className="text-sm text-green-700 mt-3">{uploadSuccess}</p>}

        <h3 className="text-lg font-semibold mt-6 mb-3">Nahrané soubory</h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">Zatím nebyly nahrány žádné soubory.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {files.map((file) => (
              <li key={file.name} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span>{file.name}</span>
                <span className="text-gray-500">{formatSize(file.sizeBytes)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#F5F9FF] rounded-2xl border border-blue-100 p-6">
        <h2 className="text-xl font-semibold mb-3 text-[#004CAF]">Jak otestovat web</h2>
        <ol className="text-sm list-decimal pl-5 space-y-2">
          <li>Nahrajte vlastní <code>index.html</code> přes FTP nebo přes upload v této stránce.</li>
          {project.domain?.endsWith('.localhost') ? (
            <li>Domény <code>*.localhost</code> se automaticky resolvují na <code>127.0.0.1</code> — stačí otevřít odkaz níže.</li>
          ) : (
            <li>Přidejte <code>{project.domain}</code> do <code>C:\Windows\System32\drivers\etc\hosts</code> (řádek: <code>127.0.0.1 {project.domain}</code>).</li>
          )}
          <li>
            Otevřete web v prohlížeči:{' '}
            <a
              href={`http://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004CAF] font-semibold underline"
            >
              http://{project.domain}
            </a>
          </li>
        </ol>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-[#004CAF] font-medium hover:underline cursor-pointer"
        >
          ← Zpět
        </button>
        <Link to="/projects" className="inline-flex items-center text-[#004CAF] font-medium hover:underline">
          Na seznam projektů
        </Link>
      </div>
    </div>
  );
}
