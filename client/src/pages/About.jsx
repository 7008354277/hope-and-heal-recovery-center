import Reveal from '../components/Reveal.jsx';
import { CtaBand, PageHero } from '../components/Bits.jsx';
import { Scene } from '../components/Scene.jsx';
import { site, supports, values } from '../content.js';

export default function About() {
  return (
    <>
      <PageHero title="About Hope and Heal Recovery Center" text="A treatment and support center for addiction and alcohol dependence, where addiction meets recovery with hope." />
      <section className="section">
        <div className="wrap split">
          <Reveal>
            <h2>Recovery is possible, and nobody has to do it alone</h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            <p>Hope and Heal Recovery Center helps people living with substance use disorders and co-occurring mental health disorders. We also work with families, because addiction affects everyone close to the person.</p>
            <p>Our approach is simple: understand the person, understand the pattern of use, and build a plan that covers detoxification support, counselling, relapse prevention, aftercare and family therapy.</p>
            <p>Break the cycle. Recover your life. That is what we work towards with every person who contacts us.</p>
          </Reveal>
        </div>
      </section>
      <section className="section center-section">
        <div className="wrap split">
          <Reveal className="frame"><Scene /></Reveal>
          <Reveal delay={120}>
            <h2>Find us in Patia, Bhubaneswar</h2>
            <p className="muted">Hope and Heal Recovery Center is located in {site.area}, {site.region}. Call ahead or send an inquiry, and we will guide you on visiting.</p>
            <p className="where"><span aria-hidden="true">📍</span> {site.address}</p>
          </Reveal>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap">
          <Reveal as="h2">What we stand for</Reveal>
          <div className="values">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="wrap split">
          <Reveal as="h2">Who we help</Reveal>
          <ul className="supports">{supports.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
