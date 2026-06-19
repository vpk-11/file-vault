import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { api, type FileEntry } from '../lib/api';

interface UploadZoneProps {
  onUploaded: (file: FileEntry) => void;
}

export default function UploadZone({ onUploaded }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const result = await api.uploadFile(file);
      onUploaded(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-3 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-colors"
        style={{
          borderColor: dragging ? 'var(--color-accent)' : 'var(--color-border)',
          backgroundColor: dragging ? 'rgba(63, 185, 80, 0.05)' : 'var(--color-surface)',
        }}
      >
        {uploading ? (
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Uploading...</span>
        ) : (
          <>
            <span className="text-3xl" aria-hidden>⬆</span>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Drop a file here or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-subtle)' }}>
                Any file type supported
              </p>
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
      )}
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
    </div>
  );
}
