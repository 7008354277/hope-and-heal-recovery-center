import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Password } from '../components/Field.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = useLocation().state?.from || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(email, password); nav(from, { replace: true }); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to see your status, book appointments and update your details.">
      <form className="form" onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <Password label="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <Link className="link-small" to="/forgot-password">Forgot password?</Link>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-navy" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
        <p className="switch">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthShell>
  );
}
