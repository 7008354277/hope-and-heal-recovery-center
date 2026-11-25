const Star = ({ fill }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <defs><linearGradient id={`g${Math.round(fill * 100)}`}><stop offset={`${fill * 100}%`} stopColor="#e8a317" /><stop offset={`${fill * 100}%`} stopColor="#d9d3e0" /></linearGradient></defs>
    <path fill={`url(#g${Math.round(fill * 100)})`} d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

export function Stars({ value, size = '1.1rem' }) {
  return (
    <span className="stars" style={{ fontSize: size }} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} fill={Math.max(0, Math.min(1, value - (i - 1)))} />)}
    </span>
  );
}

const hints = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export function StarInput({ value, onChange }) {
  return (
    <fieldset className="star-input">
      <legend>Your rating</legend>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={n <= value ? 'on' : ''} title={hints[n - 1]}>
            <input type="radio" name="rating" value={n} checked={value === n} onChange={() => onChange(n)} />
            <svg viewBox="0 0 24 24" width="2.2rem" height="2.2rem" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
            <span className="sr">{n} star{n > 1 ? 's' : ''}, {hints[n - 1]}</span>
          </label>
        ))}
        <em>{value ? hints[value - 1] : 'Tap a star'}</em>
      </div>
    </fieldset>
  );
}
