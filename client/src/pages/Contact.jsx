import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/Bits.jsx';
import { api } from '../api.js';
import { contacts, site } from '../content.js';

const blank = { name: '', phone: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(blank);
  const [state, setState] = useState({ status: 'idle', error: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', error: '' });
    try {
      await api('/inquiries', { method: 'POST', body: form });
      setForm(blank);
      setState({ status: 'sent', error: '' });
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  }

  return (
    <>
      <PageHero title="Contact us" text="Call, or leave your details and we will get back to you. Every conversation is confidential." />
      <section className="section">
        <div className="wrap split">
          <Reveal>
            <h2>Talk to us</h2>
            <ul className="people">
              {contacts.map((c) => (
                <li key={c.tel}><span>{c.name}</span><a href={`tel:${c.tel}`}>{c.phone}</a></li>
              ))}
              {site.email && <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>}
              <li>
                <span>Location</span>
                <address>
                  <strong>{site.name}</strong><br />
                  {site.addressLines.map((l) => <span key={l} className="addr">{l}<br /></span>)}
                </address>
              </li>
            </ul>
            <p className="emergency">In a medical emergency, call <strong>112</strong>. For free mental health support in India, call Tele-MANAS on <strong>14416</strong>.</p>
          </Reveal>

          <Reveal delay={120}>
            {state.status === 'sent' ? (
              <div className="card sent" role="status">
                <h3>Message received</h3>
                <p>Thank you. Someone from our team will contact you on the number you gave. If it is urgent, please call us directly.</p>
                <button className="btn btn-line" onClick={() => setState({ status: 'idle', error: '' })}>Send another message</button>
              </div>
            ) : (
              <form className="card form" onSubmit={submit}>
                <label>Your name<input value={form.name} onChange={set('name')} required autoComplete="name" /></label>
                <div className="row">
                  <label>Phone number<input value={form.phone} onChange={set('phone')} required inputMode="tel" autoComplete="tel" /></label>
                  <label>Email (optional)<input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
                </div>
                <label>Subject (optional)<input value={form.subject} onChange={set('subject')} /></label>
                <label>Message<textarea rows="5" value={form.message} onChange={set('message')} required maxLength={1500} /></label>
                {state.status === 'error' && <p className="error" role="alert">{state.error}</p>}
                <button className="btn btn-navy" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send message'}</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
      <section className="map-section">
        <div className="wrap map-head">
          <h2>Visit us in {site.area}</h2>
          <a className="btn btn-navy btn-sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`}>Get directions</a>
        </div>
        <iframe title={`Map of ${site.area}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`} />
      </section>
    </>
  );
}
