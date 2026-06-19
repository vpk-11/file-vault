import { useState } from 'react';
import { api, type FileEntry } from '../lib/api';
import { formatBytes, formatDate, fileIcon } from '../lib/fileUtils';

interface FileCardProps {
  file: FileEntry;
  onDeleted: (storedName: string) => void;
}

export default function FileCard({ file, onDeleted }: FileCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!window.confirm(`Delete "${file.originalName}"?`)) return;
    setDeleting(true);
    try {
      await api.deleteFile(file.storedName);
      onDeleted(file.storedName);
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  }

  return (
    <div
      className="flex flex-col rounded-lg p-4 gap-3 border transition-colors group"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none flex-shrink-0" aria-hidden>
          {fileIcon(file.mimeType)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}
            title={file.originalName}
          >
            {file.originalName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-subtle)' }}>
            {formatBytes(file.size)} &middot; {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>

      {error && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <a
          href={api.downloadUrl(file.storedName)}
          download={file.originalName}
          className="flex-1 text-xs text-center py-1.5 rounded transition-colors"
          style={{
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent)',
            textDecoration: 'none'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(63, 185, 80, 0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Download
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${file.originalName}`}
          className="px-3 py-1.5 rounded text-xs transition-colors cursor-pointer disabled:opacity-50"
          style={{
            color: 'var(--color-danger)',
            border: '1px solid transparent',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-danger-muted)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-danger)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
          }}
        >
          {deleting ? '...' : '🗑'}
        </button>
      </div>
    </div>
  );
}
