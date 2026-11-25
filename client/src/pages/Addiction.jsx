import Reveal from '../components/Reveal.jsx';
import { CtaBand, CycleBlock, PageHero } from '../components/Bits.jsx';

export default function Addiction() {
  return (
    <>
      <PageHero title="Understanding addiction" text="Addiction is a health condition, not a lack of willpower. Knowing how it works makes it easier to ask for help." />
      <section className="section">
        <div className="wrap">
          <Reveal as="h2">The 4 C's of addiction</Reveal>
          <p className="muted">Addiction often follows this pattern. Each stage feeds the next, which is why it feels impossible to stop alone.</p>
          <CycleBlock />
        </div>
      </section>
      <section className="section tint">
        <div className="wrap split">
          <Reveal as="h2">When to reach out</Reveal>
          <Reveal as="ul" className="checks" delay={100}>
            <li>Using more, or more often, than intended</li>
            <li>Trying to cut down and not managing to</li>
            <li>Continuing despite problems with health, work or family</li>
            <li>Low mood, anxiety or sleep problems alongside the use</li>
            <li>A family member worried about someone's drinking or drug use</li>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
