import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type FileEntry } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import UploadZone from '../components/UploadZone';
import FileCard from '../components/FileCard';
import { formatBytes } from '../lib/fileUtils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    api.listFiles()
      .then(data => setFiles(data.files))
      .catch(err => setError((err as Error).message))
      .finally(() => setFilesLoading(false));
  }, [user]);

  function handleUploaded(file: FileEntry) {
    setFiles(prev => [file, ...prev]);
  }

  function handleDeleted(storedName: string) {
    setFiles(prev => prev.filter(f => f.storedName !== storedName));
  }

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <NavBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <div>
          <UploadZone onUploaded={handleUploaded} />
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                My Files
              </h2>
              {files.length > 0 && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-subtle)' }}>
                  {files.length} {files.length === 1 ? 'file' : 'files'} &middot; {formatBytes(totalSize)} total
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>{error}</p>
          )}

          {filesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-lg animate-pulse"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span className="text-4xl mb-3" aria-hidden>📂</span>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                No files yet
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-subtle)' }}>
                Upload a file above to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map(file => (
                <FileCard key={file.storedName} file={file} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
