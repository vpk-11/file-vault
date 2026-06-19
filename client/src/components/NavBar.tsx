import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await api.logout();
    logout();
    navigate('/');
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>🗄</span>
        <span className="font-bold tracking-wide text-lg" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
          FILE VAULT
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {user?.uname}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
