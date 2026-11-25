import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { CtaBand, JourneyBlock, PageHero } from '../components/Bits.jsx';

export default function Admission() {
  return (
    <>
      <PageHero title="Admission and recovery journey" text="From the first call to long-term aftercare, here is how getting help works." />
      <section className="section">
        <div className="wrap">
          <Reveal as="h2">Five steps</Reveal>
          <JourneyBlock />
        </div>
      </section>
      <section className="section tint">
        <div className="wrap split">
          <Reveal>
            <h2>Register to begin</h2>
            <p className="muted">Registration collects background on the person, their substance use, health and an emergency contact. Your account then shows the status of your request and lets you book calls with our team.</p>
          </Reveal>
          <Reveal delay={120} className="stack">
            <Link className="btn btn-navy" to="/register">Create an account</Link>
            <Link className="btn btn-line" to="/login">I already have an account</Link>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
