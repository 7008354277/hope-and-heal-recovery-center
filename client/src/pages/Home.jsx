import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { CtaBand, CycleBlock, JourneyBlock, ServiceList } from '../components/Bits.jsx';
import { Scene } from '../components/Scene.jsx';
import { ReviewsPreview } from '../components/Reviews.jsx';
import { contacts, site, supports } from '../content.js';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="sun" aria-hidden="true"><i /></div>
        {site.heroPhoto ? <div className="hero-photo" style={{ backgroundImage: `url(${site.heroPhoto})` }} /> : <Scene className="hero-scene" />}
        <div className="hero-inner">
          <h1><span>Where addiction</span> <span>meets recovery</span> <span>with hope.</span></h1>
          <p className="lead">
            Hope and Heal Recovery Center supports people living with substance use disorders and
            co-occurring mental health conditions, and the families who stand beside them.
          </p>
          <div className="actions">
            <Link className="btn btn-navy" to="/register">Register</Link>
            <a className="btn btn-line" href={`tel:${contacts[0].tel}`}>Call {contacts[0].phone}</a>
          </div>
          <p className="note">We are open for inquiries. Every conversation is confidential.</p>
        </div>
      </section>

      <section className="section dark" id="support">
        <div className="wrap split">
          <Reveal as="h2">Who we help</Reveal>
          <ul className="supports">
            {supports.map((s, i) => <Reveal as="li" key={s} delay={i * 100}>{s}</Reveal>)}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal as="h2">Addiction runs in a cycle. Seeing it is the first step to breaking it.</Reveal>
          <CycleBlock />
        </div>
      </section>

      <section className="section center-section">
        <div className="wrap split">
          <Reveal className="frame">
            {site.heroPhoto ? <img src={site.heroPhoto} alt="Hope and Heal Recovery Center" /> : <Scene />}
          </Reveal>
          <Reveal delay={120}>
            <h2>A calm place to begin again</h2>
            <p className="muted">Recovery needs a safe, supportive setting where a person is treated with respect and families are kept involved. That is what Hope and Heal Recovery Center is here for.</p>
            <p className="where"><span aria-hidden="true">📍</span> {site.address}</p>
            <div className="actions"><Link className="btn btn-navy" to="/about">About the center</Link><Link className="btn btn-line" to="/contact">Find us</Link></div>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap split">
          <Reveal>
            <h2>Care that continues after treatment begins</h2>
            <p className="muted">Recovery is more than stopping. Our services cover the first days, the work in between, and the long stretch afterwards.</p>
            <Link className="btn btn-navy" to="/services" style={{ marginTop: '1.5rem' }}>See all services</Link>
          </Reveal>
          <ServiceList />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal as="h2">How getting help works</Reveal>
          <JourneyBlock />
        </div>
      </section>
      <ReviewsPreview />
      <CtaBand />
    </>
  );
}
