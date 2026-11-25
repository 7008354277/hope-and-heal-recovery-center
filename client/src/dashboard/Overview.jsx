import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { contacts, statusLabels, statusSteps } from '../content.js';

function AdminOverview() {
  const [s, setS] = useState(null);
  useEffect(() => { api('/admin/stats').then(setS).catch(() => setS({})); }, []);
  if (!s) return <p className="muted">Loading…</p>;
  const cards = [
    ['Registrations', s.registrations ?? 0, '/dashboard/registrations'],
    ['New inquiries', s.newInquiries ?? 0, '/dashboard/inquiries'],
    ['Pending appointments', s.pendingAppointments ?? 0, '/dashboard/appointments'],
    ['Reviews to approve', s.pendingReviews ?? 0, '/dashboard/reviews'],
  ];
  const max = Math.max(1, ...Object.values(s.byStatus || {}));
  return (
    <>
      <div className="stat-grid">
        {cards.map(([l, n, to], i) => (
          <Link key={l} to={to} className="stat" style={{ '--i': i }}><strong>{n}</strong><span>{l}</span></Link>
        ))}
      </div>
      <section className="panel">
        <h3>Registrations by status</h3>
        <ul className="bars">
          {Object.entries(statusLabels).map(([k, l]) => (
            <li key={k}><span>{l}</span><div><i style={{ width: `${((s.byStatus?.[k] || 0) / max) * 100}%` }} /></div><b>{s.byStatus?.[k] || 0}</b></li>
          ))}
        </ul>
      </section>
    </>
  );
}

function UserOverview({ user }) {
  const [appts, setAppts] = useState([]);
  useEffect(() => { api('/appointments/mine').then(setAppts).catch(() => {}); }, []);
  const upcoming = appts.filter((a) => ['requested', 'confirmed'].includes(a.status) && new Date(a.preferredDate) >= new Date(new Date().setHours(0, 0, 0, 0))).reverse()[0];
  const idx = statusSteps.indexOf(user.admissionStatus);

  return (
    <>
      <section className="panel">
        <h3>Your status: {statusLabels[user.admissionStatus]}</h3>
        {user.admissionStatus === 'closed' ? (
          <p className="muted">This request is closed. Call us any time if you need support again.</p>
        ) : (
          <ol className="track">
            {statusSteps.map((s, i) => <li key={s} className={i < idx ? 'done' : i === idx ? 'now' : ''}><span>{i < idx ? '✓' : i + 1}</span>{statusLabels[s]}</li>)}
          </ol>
        )}
        <p className="muted">Our team reviews new registrations and will contact you on {user.phone}. You can speed things up by booking a call.</p>
      </section>
      <div className="two">
        <section className="panel">
          <h3>Next appointment</h3>
          {upcoming ? (
            <p><strong>{new Date(upcoming.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'full' })}</strong><br />{upcoming.preferredTime}, {upcoming.status}</p>
          ) : <p className="muted">Nothing booked yet.</p>}
          <Link className="btn btn-navy btn-sm" to="/dashboard/appointments">Book an appointment</Link>
        </section>
        <section className="panel">
          <h3>Need to talk now?</h3>
          {contacts.map((c) => <p key={c.tel}><a className="bigtel" href={`tel:${c.tel}`}>{c.phone}</a><br /><small>{c.name}</small></p>)}
          <p className="emergency">Emergency? Call <strong>112</strong>.</p>
        </section>
      </div>
    </>
  );
}

export default function Overview() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="dash-title">Hello, {user.name.split(' ')[0]}</h1>
      {user.role === 'admin' ? <AdminOverview /> : <UserOverview user={user} />}
    </>
  );
}
