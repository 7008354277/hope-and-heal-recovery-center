import { Fragment, useEffect, useState } from 'react';
import { api } from '../api.js';
import { programLabels, statusLabels } from '../content.js';

const when = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function Registrations() {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const load = (term = '') => api(`/admin/users?q=${encodeURIComponent(term)}`).then(setItems);
  useEffect(() => { const t = setTimeout(() => load(q), 250); return () => clearTimeout(t); }, [q]);

  async function setStatus(id, status) {
    const u = await api(`/admin/users/${id}/status`, { method: 'PATCH', body: { status } });
    setItems(items.map((i) => (i._id === id ? { ...i, admissionStatus: u.admissionStatus } : i)));
  }

  return (
    <>
      <h1 className="dash-title">Registrations</h1>
      <section className="panel">
        <label className="search">Search<input placeholder="Name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        {!items ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">No registrations found.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Registered</th><th>Name</th><th>Phone</th><th>For</th><th>Service</th><th>Status</th><th /></tr></thead>
              <tbody>
                {items.map((u) => (
                  <Fragment key={u._id}>
                    <tr>
                      <td>{when(u.createdAt)}</td>
                      <td>{u.name}<br /><small>{u.email}</small></td>
                      <td><a href={`tel:${u.phone}`}>{u.phone}</a></td>
                      <td>{u.registeringFor === 'self' ? 'Self' : `${u.patientName || ''} (${u.registeringFor})`}</td>
                      <td>{programLabels[u.program]}</td>
                      <td>
                        <select value={u.admissionStatus} onChange={(e) => setStatus(u._id, e.target.value)}>
                          {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </td>
                      <td><button className="link-btn" onClick={() => setOpen(open === u._id ? null : u._id)}>{open === u._id ? 'Hide' : 'Details'}</button></td>
                    </tr>
                    {open === u._id && (
                      <tr className="detail"><td colSpan="7">
                        <dl>
                          <div><dt>Age / gender</dt><dd>{u.age || '-'} / {u.gender}</dd></div>
                          <div><dt>Location</dt><dd>{[u.address, u.city, u.state].filter(Boolean).join(', ') || '-'}</dd></div>
                          <div><dt>Substances</dt><dd>{u.substances?.join(', ') || '-'} ({u.durationOfUse})</dd></div>
                          <div><dt>Previous treatment</dt><dd>{u.previousTreatment ? u.previousTreatmentDetails || 'Yes' : 'No'}</dd></div>
                          <div><dt>Medical conditions</dt><dd>{u.medicalConditions || '-'}</dd></div>
                          <div><dt>Medications</dt><dd>{u.currentMedications || '-'}</dd></div>
                          <div><dt>Mental health</dt><dd>{u.mentalHealthConcerns || '-'}</dd></div>
                          <div><dt>Emergency contact</dt><dd>{u.emergencyName} ({u.emergencyRelation || '-'}) <a href={`tel:${u.emergencyPhone}`}>{u.emergencyPhone}</a></dd></div>
                        </dl>
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export function Inquiries() {
  const [items, setItems] = useState(null);
  useEffect(() => { api('/inquiries').then(setItems); }, []);
  async function setStatus(id, status) {
    await api(`/inquiries/${id}`, { method: 'PATCH', body: { status } });
    setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
  }
  return (
    <>
      <h1 className="dash-title">Inquiries</h1>
      <section className="panel">
        {!items ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">No inquiries yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Subject</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id}>
                    <td>{when(i.createdAt)}</td>
                    <td>{i.name}{i.email && <><br /><small>{i.email}</small></>}</td>
                    <td><a href={`tel:${i.phone}`}>{i.phone}</a></td>
                    <td>{i.subject}</td><td className="msg">{i.message}</td>
                    <td>
                      <select value={i.status} onChange={(e) => setStatus(i._id, e.target.value)}>
                        <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                      </select>
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

export function ReviewsAdmin() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [replies, setReplies] = useState({});
  const load = () => api(`/reviews/all?status=${filter}`).then(setItems);
  useEffect(() => { setItems(null); load(); }, [filter]);

  const patch = async (id, body) => { await api(`/reviews/${id}`, { method: 'PATCH', body }); load(); };
  const remove = async (id) => { if (window.confirm('Delete this review permanently?')) { await api(`/reviews/${id}`, { method: 'DELETE' }); load(); } };

  return (
    <>
      <h1 className="dash-title">Reviews</h1>
      <section className="panel">
        <div className="tabs" role="tablist">
          {[['pending', 'To approve'], ['approved', 'Published'], ['hidden', 'Hidden'], ['all', 'All']].map(([v, l]) => (
            <button key={v} role="tab" aria-selected={filter === v} className={filter === v ? 'on' : ''} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        {!items ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">No reviews here.</p> : (
          <ul className="admin-reviews">
            {items.map((r) => (
              <li key={r._id}>
                <div className="review-head">
                  <div>
                    <strong>{r.name}</strong>{r.anonymous && <span className="pill"> shown as Anonymous</span>}
                    <small>{when(r.createdAt)} · {r.relation}</small>
                  </div>
                  <span className="rate-num">{'★'.repeat(r.rating)}<span>{'★'.repeat(5 - r.rating)}</span></span>
                </div>
                {r.title && <h4>{r.title}</h4>}
                <p>{r.text}</p>
                <label className="reply">Public reply (optional)
                  <textarea rows="2" maxLength={600} value={replies[r._id] ?? r.reply ?? ''} onChange={(e) => setReplies({ ...replies, [r._id]: e.target.value })} />
                </label>
                <div className="admin-actions">
                  <span className={`pill ${r.status === 'approved' ? 'confirmed' : r.status === 'hidden' ? 'cancelled' : ''}`}>{r.status}</span>
                  {r.status !== 'approved' && <button className="btn btn-navy btn-sm" onClick={() => patch(r._id, { status: 'approved', reply: replies[r._id] ?? r.reply ?? '' })}>Approve</button>}
                  {r.status !== 'hidden' && <button className="btn btn-line btn-sm" onClick={() => patch(r._id, { status: 'hidden' })}>Hide</button>}
                  <button className="btn btn-line btn-sm" onClick={() => patch(r._id, { reply: replies[r._id] ?? r.reply ?? '' })}>Save reply</button>
                  <button className="link-btn" onClick={() => remove(r._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
