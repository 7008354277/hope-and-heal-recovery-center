import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Stars, StarInput } from './Stars.jsx';
import Reveal from './Reveal.jsx';
import { relationLabels } from '../content.js';

export function useReviews(limit = 50, refreshKey = 0) {
  const [data, setData] = useState(null);
  useEffect(() => {
    api(`/reviews?limit=${limit}`).then(setData).catch(() => setData({ summary: { count: 0, average: 0, distribution: {} }, reviews: [] }));
  }, [limit, refreshKey]);
  return data;
}

export function RatingSummary({ summary }) {
  const { count, average, distribution } = summary;
  return (
    <div className="rating-summary">
      <div className="rating-big">
        <strong>{count ? average.toFixed(1) : '–'}</strong>
        <Stars value={average} size="1.5rem" />
        <span>{count ? `${count} review${count > 1 ? 's' : ''}` : 'No reviews yet'}</span>
      </div>
      <ul className="rating-bars">
        {[5, 4, 3, 2, 1].map((n) => (
          <li key={n}>
            <span>{n} star</span>
            <div><i style={{ width: `${count ? ((distribution[n] || 0) / count) * 100 : 0}%` }} /></div>
            <b>{distribution[n] || 0}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewCard({ r, delay = 0 }) {
  return (
    <Reveal as="article" className="review" delay={delay}>
      <div className="review-head">
        <span className="avatar" aria-hidden="true">{r.name.trim()[0]?.toUpperCase()}</span>
        <div>
          <strong>{r.name}</strong>
          <small>{relationLabels[r.relation]} · {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</small>
        </div>
        <Stars value={r.rating} />
      </div>
      {r.title && <h3>{r.title}</h3>}
      <p>{r.text}</p>
      {r.reply && <div className="review-reply"><strong>Reply from Hope and Heal</strong><p>{r.reply}</p></div>}
    </Reveal>
  );
}

const blank = { name: '', anonymous: false, rating: 0, title: '', relation: 'patient', text: '', website: '' };

export function ReviewForm() {
  const [f, setF] = useState(blank);
  const [state, setState] = useState({ status: 'idle', error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.rating) return setState({ status: 'error', error: 'Please choose a star rating.' });
    setState({ status: 'sending', error: '' });
    try { await api('/reviews', { method: 'POST', body: f }); setF(blank); setState({ status: 'sent', error: '' }); }
    catch (err) { setState({ status: 'error', error: err.message }); }
  }

  if (state.status === 'sent') {
    return (
      <div className="card sent" role="status">
        <h3>Thank you for your review</h3>
        <p>It has been sent to our team and will appear on the website once it is approved.</p>
        <button className="btn btn-line" onClick={() => setState({ status: 'idle', error: '' })}>Write another review</button>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Share your experience</h3>
      <StarInput value={f.rating} onChange={(rating) => setF({ ...f, rating })} />
      <div className="row">
        <label>Your name<input value={f.name} onChange={set('name')} required maxLength={60} autoComplete="name" /></label>
        <label>You are a
          <select value={f.relation} onChange={set('relation')}>
            {Object.entries(relationLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <label>Headline (optional)<input value={f.title} onChange={set('title')} maxLength={100} placeholder="Sum up your experience" /></label>
      <label>Your review<textarea rows="5" value={f.text} onChange={set('text')} required minLength={10} maxLength={1000} placeholder="What was your experience with Hope and Heal Recovery Center?" /></label>
      <label className="check"><input type="checkbox" checked={f.anonymous} onChange={set('anonymous')} /><span>Show my review as “Anonymous” (our team still sees your name)</span></label>
      <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set('website')} />
      {state.status === 'error' && <p className="error" role="alert">{state.error}</p>}
      <button className="btn btn-navy" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Submitting…' : 'Submit review'}</button>
      <p className="muted small">Reviews are checked by our team before they are published. Please do not include phone numbers or other people's private details.</p>
    </form>
  );
}

export function ReviewsPreview() {
  const data = useReviews(3);
  return (
    <section className="section tint">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="h2">What people say about us</Reveal>
          <Reveal className="stack" delay={100}><Link className="btn btn-navy" to="/reviews">Read and write reviews</Link></Reveal>
        </div>
        {!data ? <p className="muted">Loading…</p> : (
          <>
            <Reveal><RatingSummary summary={data.summary} /></Reveal>
            {data.reviews.length > 0 ? (
              <div className="review-grid">{data.reviews.map((r, i) => <ReviewCard key={r._id} r={r} delay={i * 100} />)}</div>
            ) : (
              <p className="muted">Be the first to share your experience. <Link to="/reviews" style={{ fontWeight: 600 }}>Write a review</Link></p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
