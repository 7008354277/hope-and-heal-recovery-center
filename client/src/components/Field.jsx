import { useState } from 'react';

export function Password({ label, value, onChange, autoComplete, hint }) {
  const [show, setShow] = useState(false);
  return (
    <label>{label}
      <span className="pw">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
      </span>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Chips({ options, value, onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="chips">
      {options.map(([v, l]) => (
        <button type="button" key={v} className={value.includes(v) ? 'on' : ''} aria-pressed={value.includes(v)} onClick={() => toggle(v)}>{l}</button>
      ))}
    </div>
  );
}
