import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { Horizon } from './Scene.jsx';
import { contacts, cycle, journey, services } from '../content.js';

export function PageHero({ title, text }) {
  return (
    <section className="page-hero">
      <div className="page-sun" aria-hidden="true" />
      <div className="wrap">
        <h1>{title}</h1>
        {text && <p className="lead">{text}</p>}
      </div>
      <Horizon />
    </section>
  );
}

export function CycleBlock() {
  return (
    <>
      <ol className="cycle">
        {cycle.map((c, i) => (
          <Reveal as="li" key={c.title} delay={i * 120}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal as="p" className="break">Break the cycle. Recover your life.</Reveal>
    </>
  );
}

export function ServiceList({ detailed = false }) {
  return (
    <dl className="services">
      {services.map((s, i) => (
        <Reveal key={s.name} delay={i * 80}>
          <dt>{s.name}</dt>
          <dd>{detailed ? s.detail : s.text}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

export function JourneyBlock() {
  return (
    <ol className="journey">
      {journey.map((j, i) => (
        <Reveal as="li" key={j.title} delay={i * 100}>
          <h3>{j.title}</h3>
          <p>{j.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <Reveal>
          <h2>Your new beginning starts here.</h2>
          <p>Call us, or create an account to share a few details before we talk.</p>
        </Reveal>
        <Reveal className="cta-actions" delay={150}>
          <a className="btn btn-gold" href={`tel:${contacts[0].tel}`}>Call {contacts[0].phone}</a>
          <Link className="btn btn-light" to="/register">Register</Link>
        </Reveal>
      </div>
    </section>
  );
}
