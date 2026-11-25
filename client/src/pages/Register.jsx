import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Chips, Password } from '../components/Field.jsx';
import { useAuth } from '../AuthContext.jsx';
import { programLabels } from '../content.js';

const steps = ['Account', 'About the person', 'Substance use', 'Health and contact'];
const phoneRe = /^\+?[\d\s-]{8,16}$/;

const start = {
  name: '', email: '', phone: '', password: '', confirm: '',
  registeringFor: 'self', patientName: '', age: '', gender: 'prefer-not', city: '', state: '', address: '',
  substances: [], durationOfUse: 'not-sure', previousTreatment: false, previousTreatmentDetails: '', program: 'not-sure',
  medicalConditions: '', currentMedications: '', mentalHealthConcerns: '',
  emergencyName: '', emergencyRelation: '', emergencyPhone: '', consent: false,
};

function check(step, f) {
  if (step === 0) {
    if (!f.name.trim()) return 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Enter a valid email address.';
    if (!phoneRe.test(f.phone)) return 'Enter a valid phone number.';
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(f.password)) return 'Password must be at least 8 characters with a letter and a number.';
    if (f.password !== f.confirm) return 'The two passwords do not match.';
  }
  if (step === 1) {
    if (f.registeringFor !== 'self' && !f.patientName.trim()) return 'Enter the name of the person who needs support.';
    if (f.age && (f.age < 10 || f.age > 100)) return 'Enter an age between 10 and 100.';
  }
  if (step === 3) {
    if (!f.emergencyName.trim()) return 'Enter an emergency contact name.';
    if (!phoneRe.test(f.emergencyPhone)) return 'Enter a valid emergency contact phone number.';
    if (!f.consent) return 'Please accept the consent to continue.';
  }
  return '';
}

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(start);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const forOther = f.registeringFor !== 'self';

  function next() {
    const msg = check(step, f);
    if (msg) return setError(msg);
    setError(''); setStep(step + 1);
  }

  async function submit(e) {
    e.preventDefault();
    const msg = check(3, f);
    if (msg) return setError(msg);
    setBusy(true); setError('');
    try {
      const { confirm, ...body } = f;
      await register({ ...body, age: f.age ? Number(f.age) : undefined });
      nav('/dashboard', { replace: true });
    } catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <AuthShell wide title="Create your account" subtitle="Share some background so our team understands the situation before we speak. Everything is confidential.">
      <ol className="stepper" aria-label="Progress">
        {steps.map((s, i) => <li key={s} className={i === step ? 'now' : i < step ? 'done' : ''}><span>{i + 1}</span>{s}</li>)}
      </ol>

      <form className="form" onSubmit={submit} noValidate key={step}>
        <div className="step-body">
          {step === 0 && (
            <>
              <label>Your full name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>
              <div className="row">
                <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
                <label>Phone number<input value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></label>
              </div>
              <div className="row">
                <Password label="Password" value={f.password} onChange={set('password')} autoComplete="new-password" hint="At least 8 characters, with a letter and a number." />
                <Password label="Confirm password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <label>I am registering for
                <select value={f.registeringFor} onChange={set('registeringFor')}>
                  <option value="self">Myself</option>
                  <option value="family">A family member</option>
                  <option value="friend">A friend</option>
                </select>
              </label>
              {forOther && <label>Name of the person who needs support<input value={f.patientName} onChange={set('patientName')} /></label>}
              <div className="row">
                <label>Age of the person (optional)<input type="number" min="10" max="100" value={f.age} onChange={set('age')} /></label>
                <label>Gender
                  <select value={f.gender} onChange={set('gender')}>
                    <option value="prefer-not">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <div className="row">
                <label>City<input value={f.city} onChange={set('city')} autoComplete="address-level2" /></label>
                <label>State<input value={f.state} onChange={set('state')} autoComplete="address-level1" /></label>
              </div>
              <label>Address (optional)<textarea rows="2" value={f.address} onChange={set('address')} /></label>
            </>
          )}

          {step === 2 && (
            <>
              <fieldset>
                <legend>Substances involved (select all that apply)</legend>
                <Chips value={f.substances} onChange={(v) => setF({ ...f, substances: v })}
                  options={[['alcohol', 'Alcohol'], ['opioids', 'Opioids'], ['cannabis', 'Cannabis'], ['stimulants', 'Stimulants'], ['sedatives', 'Sedatives'], ['tobacco', 'Tobacco'], ['other', 'Other']]} />
              </fieldset>
              <div className="row">
                <label>How long has this been going on?
                  <select value={f.durationOfUse} onChange={set('durationOfUse')}>
                    <option value="not-sure">Not sure</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-3">1 to 3 years</option>
                    <option value="3-5">3 to 5 years</option>
                    <option value="5-plus">More than 5 years</option>
                  </select>
                </label>
                <label>Service of interest
                  <select value={f.program} onChange={set('program')}>
                    {Object.entries(programLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
              </div>
              <label className="check"><input type="checkbox" checked={f.previousTreatment} onChange={set('previousTreatment')} /><span>There has been treatment or rehabilitation before</span></label>
              {f.previousTreatment && <label>Tell us briefly about it<textarea rows="3" value={f.previousTreatmentDetails} onChange={set('previousTreatmentDetails')} placeholder="Where, when, and what happened afterwards" /></label>}
            </>
          )}

          {step === 3 && (
            <>
              <label>Medical conditions (optional)<textarea rows="2" value={f.medicalConditions} onChange={set('medicalConditions')} placeholder="For example diabetes, liver problems, seizures" /></label>
              <label>Current medications (optional)<textarea rows="2" value={f.currentMedications} onChange={set('currentMedications')} /></label>
              <label>Mental health concerns (optional)<textarea rows="2" value={f.mentalHealthConcerns} onChange={set('mentalHealthConcerns')} placeholder="For example anxiety, depression, sleep problems" /></label>
              <h3 className="sub">Emergency contact</h3>
              <div className="row">
                <label>Name<input value={f.emergencyName} onChange={set('emergencyName')} /></label>
                <label>Relationship<input value={f.emergencyRelation} onChange={set('emergencyRelation')} placeholder="Mother, spouse, friend…" /></label>
              </div>
              <label>Phone number<input value={f.emergencyPhone} onChange={set('emergencyPhone')} inputMode="tel" /></label>
              <label className="check"><input type="checkbox" checked={f.consent} onChange={set('consent')} />
                <span>I confirm the details are correct and agree that the center may contact me and use this information to support the person's care.</span></label>
            </>
          )}
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-nav">
          {step > 0 && <button type="button" className="btn btn-line" onClick={() => { setError(''); setStep(step - 1); }}>Back</button>}
          {step < 3 ? <button type="button" className="btn btn-navy" onClick={next}>Continue</button>
            : <button className="btn btn-gold" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>}
        </div>
        <p className="switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </AuthShell>
  );
}
