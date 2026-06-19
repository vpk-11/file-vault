import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type FileEntry } from '../lib/api';
import matrixBg from '../assets/matrix.jpg';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uname, setUname] = useState('');

  useEffect(() => {
    api.me()
      .then(data => setUname(data.user.uname))
      .catch(() => navigate('/'));

    api.listFiles()
      .then(data => setFiles(data.files))
      .catch(() => {});
  }, [navigate]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(e.target.files?.[0] ?? null);
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadError('');
    try {
      await api.uploadFile(selectedFile);
      const data = await api.listFiles();
      setFiles(data.files);
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setUploadError((err as Error).message);
    }
  }

  async function handleLogout() {
    await api.logout();
    navigate('/');
  }

  return (
    <div style={{ backgroundImage: `url(${matrixBg})`, minHeight: '100vh' }}>
      <center>
        <div id="container">
          <h1>Welcome, {uname}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div id="container">
          <div className="cont">
            <h3>Upload a File</h3>
            <form onSubmit={handleUpload}>
              <input type="file" name="avatar" onChange={handleFileChange} required />
              {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>

        <div id="container">
          <div className="cont">
            <h3>Your Files</h3>
            {files.length === 0 ? (
              <p>No files uploaded yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {files.map(f => (
                  <li key={f.storedName} style={{ margin: '8px 0' }}>
                    <a href={api.downloadUrl(f.storedName)} target="_blank" rel="noreferrer">
                      {f.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </center>
    </div>
  );
}
