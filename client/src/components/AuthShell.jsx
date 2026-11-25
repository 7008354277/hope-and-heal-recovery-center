import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { Horizon } from './Scene.jsx';

export default function AuthShell({ title, subtitle, children, wide = false }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-sun" aria-hidden="true" />
        <Horizon dark />
        <Logo light />
        <div>
          <h2>Where addiction meets recovery with hope.</h2>
          <p>Your details are kept private and are only used by our team to support you.</p>
        </div>
        <Link to="/" className="auth-back">Back to website</Link>
      </aside>
      <main className={`auth-main ${wide ? 'wide' : ''}`}>
        <div className="auth-card">
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
