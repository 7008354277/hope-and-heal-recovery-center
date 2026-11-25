import Reveal from '../components/Reveal.jsx';
import { CtaBand, PageHero, ServiceList } from '../components/Bits.jsx';

export default function Services() {
  return (
    <>
      <PageHero title="Our services" text="Detoxification support, counselling, relapse prevention, aftercare and family therapy: care for each stage of recovery." />
      <section className="section">
        <div className="wrap split">
          <Reveal>
            <h2>Support for every stage</h2>
            <p className="muted">Not sure which service fits? Register or call us, and we will help you choose after we understand the situation.</p>
          </Reveal>
          <ServiceList detailed />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
