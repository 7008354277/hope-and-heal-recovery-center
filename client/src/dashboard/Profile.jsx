import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Chips, Password } from '../components/Field.jsx';
import { programLabels } from '../content.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ ...user, age: user.age ?? '' });
  const [msg, setMsg] = useState(null);
  const [pw, setPw] = useState({ current: '', password: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const { user: u } = await api('/auth/me', { method: 'PUT', body: { ...f, age: f.age ? Number(f.age) : undefined } });
      setUser(u); setMsg({ ok: true, text: 'Profile saved.' });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  }

  async function changePw(e) {
    e.preventDefault();
    setPwMsg(null);
    try { await api('/auth/password', { method: 'PUT', body: pw }); setPw({ current: '', password: '' }); setPwMsg({ ok: true, text: 'Password changed.' }); }
    catch (err) { setPwMsg({ ok: false, text: err.message }); }
  }

  const isAdmin = user.role === 'admin';
  return (
    <>
      <h1 className="dash-title">My profile</h1>
      <form className="panel form" onSubmit={save}>
        <h3>Account</h3>
        <div className="row">
          <label>Full name<input value={f.name || ''} onChange={set('name')} /></label>
          <label>Phone<input value={f.phone || ''} onChange={set('phone')} /></label>
        </div>
        <label>Email<input value={f.email} disabled /></label>
        {!isAdmin && (
          <>
            <h3>About the person</h3>
            <div className="row">
              <label>Registered for
                <select value={f.registeringFor} onChange={set('registeringFor')}>
                  <option value="self">Myself</option><option value="family">A family member</option><option value="friend">A friend</option>
                </select>
              </label>
              <label>Person's name<input value={f.patientName || ''} onChange={set('patientName')} /></label>
            </div>
            <div className="row">
              <label>Age<input type="number" value={f.age} onChange={set('age')} /></label>
              <label>Gender
                <select value={f.gender} onChange={set('gender')}>
                  <option value="prefer-not">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </label>
            </div>
            <div className="row">
              <label>City<input value={f.city || ''} onChange={set('city')} /></label>
              <label>State<input value={f.state || ''} onChange={set('state')} /></label>
            </div>
            <h3>Substance use</h3>
            <Chips value={f.substances || []} onChange={(v) => setF({ ...f, substances: v })}
              options={[['alcohol', 'Alcohol'], ['opioids', 'Opioids'], ['cannabis', 'Cannabis'], ['stimulants', 'Stimulants'], ['sedatives', 'Sedatives'], ['tobacco', 'Tobacco'], ['other', 'Other']]} />
            <label>Service of interest
              <select value={f.program} onChange={set('program')}>
                {Object.entries(programLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <h3>Health</h3>
            <label>Medical conditions<textarea rows="2" value={f.medicalConditions || ''} onChange={set('medicalConditions')} /></label>
            <label>Current medications<textarea rows="2" value={f.currentMedications || ''} onChange={set('currentMedications')} /></label>
            <label>Mental health concerns<textarea rows="2" value={f.mentalHealthConcerns || ''} onChange={set('mentalHealthConcerns')} /></label>
            <h3>Emergency contact</h3>
            <div className="row">
              <label>Name<input value={f.emergencyName || ''} onChange={set('emergencyName')} /></label>
              <label>Relationship<input value={f.emergencyRelation || ''} onChange={set('emergencyRelation')} /></label>
            </div>
            <label>Phone<input value={f.emergencyPhone || ''} onChange={set('emergencyPhone')} /></label>
          </>
        )}
        {msg && <p className={msg.ok ? 'ok' : 'error'} role="status">{msg.text}</p>}
        <button className="btn btn-navy">Save changes</button>
      </form>

      <form className="panel form" onSubmit={changePw}>
        <h3>Change password</h3>
        <div className="row">
          <Password label="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
          <Password label="New password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} autoComplete="new-password" hint="At least 8 characters, with a letter and a number." />
        </div>
        {pwMsg && <p className={pwMsg.ok ? 'ok' : 'error'} role="status">{pwMsg.text}</p>}
        <button className="btn btn-line">Change password</button>
      </form>
    </>
  );
}
