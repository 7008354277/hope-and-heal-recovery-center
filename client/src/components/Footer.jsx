import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { contacts, site } from '../content.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo light />
          <p className="footer-tag">{site.tagline}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/about">About us</Link>
          <Link to="/services">Services</Link>
          <Link to="/addiction">Understanding addiction</Link>
          <Link to="/admission">Admission</Link>
          <Link to="/reviews">Reviews</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/forgot-password">Forgot password</Link>
        </div>
        <div>
          <h4>Contact</h4>
          {contacts.map((c) => <a key={c.tel} href={`tel:${c.tel}`}>{c.name}<br /><strong>{c.phone}</strong></a>)}
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          <p>{site.name}<br />{site.addressLines.join(', ')}</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} {site.name}. General information only; not a substitute for medical advice. In an emergency call 112.</p>
      </div>
    </footer>
  );
}
