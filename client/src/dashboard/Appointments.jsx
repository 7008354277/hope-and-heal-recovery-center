import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const types = { 'assessment-call': 'Assessment call', counselling: 'Counselling session', 'family-session': 'Family session', 'center-visit': 'Center visit' };
const date = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });
const today = () => new Date().toISOString().slice(0, 10);

export default function Appointments() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [items, setItems] = useState(null);
  const [f, setF] = useState({ type: 'assessment-call', preferredDate: '', preferredTime: 'morning', note: '' });
  const [error, setError] = useState('');
  const load = () => api(isAdmin ? '/appointments' : '/appointments/mine').then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function book(e) {
    e.preventDefault(); setError('');
    try { await api('/appointments', { method: 'POST', body: f }); setF({ ...f, preferredDate: '', note: '' }); load(); }
    catch (err) { setError(err.message); }
  }
  const cancel = async (id) => { await api(`/appointments/${id}/cancel`, { method: 'PATCH' }).catch(() => {}); load(); };
  const setStatus = async (id, status) => { await api(`/appointments/${id}`, { method: 'PATCH', body: { status } }); load(); };

  return (
    <>
      <h1 className="dash-title">Appointments</h1>
      {!isAdmin && (
        <form className="panel form" onSubmit={book}>
          <h3>Request an appointment</h3>
          <div className="row">
            <label>Type<select value={f.type} onChange={set('type')}>{Object.entries(types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            <label>Preferred date<input type="date" min={today()} value={f.preferredDate} onChange={set('preferredDate')} required /></label>
            <label>Time of day<select value={f.preferredTime} onChange={set('preferredTime')}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label>
          </div>
          <label>Anything we should know (optional)<textarea rows="2" value={f.note} onChange={set('note')} maxLength={500} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-navy">Request appointment</button>
          <p className="muted small">Requests are confirmed by our team, who will call you to agree on a time.</p>
        </form>
      )}
      <section className="panel">
        <h3>{isAdmin ? 'All appointment requests' : 'Your requests'}</h3>
        {!items ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">No appointments yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr>{isAdmin && <th>Person</th>}<th>Date</th><th>Time</th><th>Type</th><th>Note</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id}>
                    {isAdmin && <td>{a.user?.name}<br /><a href={`tel:${a.user?.phone}`}>{a.user?.phone}</a></td>}
                    <td>{date(a.preferredDate)}</td><td>{a.preferredTime}</td><td>{types[a.type]}</td><td className="msg">{a.note}</td>
                    <td>
                      {isAdmin ? (
                        <select value={a.status} onChange={(e) => setStatus(a._id, e.target.value)}>
                          {['requested', 'confirmed', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <>
                          <span className={`pill ${a.status}`}>{a.status}</span>
                          {a.status === 'requested' && <button className="link-btn" onClick={() => cancel(a._id)}>Cancel</button>}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
