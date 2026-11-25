import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Password } from '../components/Field.jsx';
import { api } from '../api.js';

export default function Reset() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true); setError('');
    try { await api(`/auth/reset-password/${token}`, { method: 'POST', body: { password } }); setDone(true); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <AuthShell title="Set a new password">
      {done ? (
        <div className="notice" role="status"><p>Your password has been updated.</p><Link className="btn btn-navy" to="/login">Login</Link></div>
      ) : (
        <form className="form" onSubmit={submit}>
          <Password label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" hint="At least 8 characters, with a letter and a number." />
          <Password label="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-navy" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button>
        </form>
      )}
    </AuthShell>
  );
}
