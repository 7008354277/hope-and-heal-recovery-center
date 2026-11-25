import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { api } from '../api.js';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { setMsg((await api('/auth/forgot-password', { method: 'POST', body: { email } })).message); }
    catch (err) { setError(err.message); }
    setBusy(false);
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter the email you registered with and we will send a link to set a new password.">
      {msg ? (
        <div className="notice" role="status"><p>{msg}</p><Link className="btn btn-navy" to="/login">Back to login</Link></div>
      ) : (
        <form className="form" onSubmit={submit}>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-navy" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
          <p className="switch"><Link to="/login">Back to login</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
