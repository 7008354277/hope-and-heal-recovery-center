import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = user.role === 'admin';
  const links = [
    ['/dashboard', 'Overview', true],
    ['/dashboard/appointments', 'Appointments'],
    ...(isAdmin ? [['/dashboard/registrations', 'Registrations'], ['/dashboard/inquiries', 'Inquiries'], ['/dashboard/reviews', 'Reviews']] : []),
    ['/dashboard/profile', 'My profile'],
  ];

  return (
    <div className="dash">
      <aside className={`dash-side ${open ? 'open' : ''}`}>
        <Logo light />
        <nav onClick={() => setOpen(false)}>
          {links.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
        </nav>
        <div className="dash-foot">
          <NavLink to="/">View website</NavLink>
          <button onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="dash-main">
        <header className="dash-top">
          <button className="burger dark" aria-label="Open menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
          <div>
            <strong>{user.name}</strong>
            <small>{isAdmin ? 'Staff account' : user.email}</small>
          </div>
        </header>
        <div className="dash-body"><Outlet /></div>
      </div>
    </div>
  );
}
