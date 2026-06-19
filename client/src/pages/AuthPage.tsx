import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import matrixBg from '../assets/matrix.jpg';

export default function AuthPage() {
  const navigate = useNavigate();

  const [signupForm, setSignupForm] = useState({ uname: '', age: '', email: '', pswd: '' });
  const [loginForm, setLoginForm] = useState({ uname: '', pswd: '' });
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setSignupError('');
    try {
      await api.signup(signupForm.uname, signupForm.pswd, Number(signupForm.age), signupForm.email);
      setSignupForm({ uname: '', age: '', email: '', pswd: '' });
      alert('Account created! You can now log in.');
    } catch (err) {
      setSignupError((err as Error).message);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      await api.login(loginForm.uname, loginForm.pswd);
      navigate('/dashboard');
    } catch (err) {
      setLoginError((err as Error).message);
    }
  }

  return (
    <div style={{ backgroundImage: `url(${matrixBg})`, minHeight: '100vh' }}>
      <center>
        <div id="container">
          <h1>Welcome to the Real World....</h1>
          <p>Join In to escape the Matrix</p>
        </div>

        <div id="container">
          <div id="signup" className="cont">
            <form onSubmit={handleSignup}>
              <h3>Sign in</h3>
              <input
                type="text"
                placeholder="User name"
                required
                value={signupForm.uname}
                onChange={e => setSignupForm(f => ({ ...f, uname: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Age"
                required
                value={signupForm.age}
                onChange={e => setSignupForm(f => ({ ...f, age: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Email"
                required
                value={signupForm.email}
                onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={signupForm.pswd}
                onChange={e => setSignupForm(f => ({ ...f, pswd: e.target.value }))}
              />
              {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
              <button type="submit">Sign up</button>
            </form>
          </div>
          <br />
          <div id="login" className="cont">
            <form onSubmit={handleLogin}>
              <h3>Login</h3>
              <input
                type="text"
                placeholder="Username"
                required
                value={loginForm.uname}
                onChange={e => setLoginForm(f => ({ ...f, uname: e.target.value }))}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginForm.pswd}
                onChange={e => setLoginForm(f => ({ ...f, pswd: e.target.value }))}
              />
              {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
          <br />
        </div>
      </center>
    </div>
  );
}
