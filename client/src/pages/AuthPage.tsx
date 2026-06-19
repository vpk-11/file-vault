import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Tab = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>('login');

  const [loginForm, setLoginForm] = useState({ uname: '', pswd: '' });
  const [signupForm, setSignupForm] = useState({ uname: '', age: '', email: '', pswd: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(loginForm.uname, loginForm.pswd);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.signup(signupForm.uname, signupForm.pswd, Number(signupForm.age), signupForm.email);
      setSuccess('Account created. You can now log in.');
      setSignupForm({ uname: '', age: '', email: '', pswd: '' });
      setTimeout(() => { setTab('login'); setSuccess(''); }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setSuccess('');
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'var(--color-surface-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden>🗄</span>
          <h1 className="mt-2 text-2xl font-bold tracking-wide" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
            FILE VAULT
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Your personal file storage
          </p>
        </div>

        <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex rounded-md mb-6 p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-muted)' }}>
            {(['login', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-1.5 text-sm font-medium rounded transition-colors capitalize cursor-pointer"
                style={{
                  backgroundColor: tab === t ? 'var(--color-surface)' : 'transparent',
                  color: tab === t ? 'var(--color-text)' : 'var(--color-text-muted)',
                  border: tab === t ? '1px solid var(--color-border)' : '1px solid transparent'
                }}
              >
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                required
                autoComplete="username"
                value={loginForm.uname}
                onChange={e => setLoginForm(f => ({ ...f, uname: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={loginForm.pswd}
                onChange={e => setLoginForm(f => ({ ...f, pswd: e.target.value }))}
                style={inputStyle}
              />
              {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-semibold rounded transition-opacity cursor-pointer disabled:opacity-60 mt-1"
                style={{ backgroundColor: 'var(--color-accent)', color: '#0d1117', border: 'none' }}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                required
                autoComplete="username"
                value={signupForm.uname}
                onChange={e => setSignupForm(f => ({ ...f, uname: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                value={signupForm.email}
                onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Age"
                required
                min={1}
                max={120}
                value={signupForm.age}
                onChange={e => setSignupForm(f => ({ ...f, age: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                required
                minLength={8}
                autoComplete="new-password"
                value={signupForm.pswd}
                onChange={e => setSignupForm(f => ({ ...f, pswd: e.target.value }))}
                style={inputStyle}
              />
              {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}
              {success && <p className="text-sm" style={{ color: 'var(--color-accent)' }}>{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-semibold rounded transition-opacity cursor-pointer disabled:opacity-60 mt-1"
                style={{ backgroundColor: 'var(--color-accent)', color: '#0d1117', border: 'none' }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
