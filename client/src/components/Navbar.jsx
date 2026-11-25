import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'],
  ['/addiction', 'Addiction'], ['/admission', 'Admission'], ['/reviews', 'Reviews'], ['/contact', 'Contact'],
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Logo />
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={open ? 'open' : ''} aria-label="Main">
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
        <div className="nav-actions">
          {user ? (
            <Link className="btn btn-navy btn-sm" to="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link className="btn btn-line btn-sm" to="/login">Login</Link>
              <Link className="btn btn-gold btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
