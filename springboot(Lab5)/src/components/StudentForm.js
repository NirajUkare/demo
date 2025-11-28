import React, { useState } from 'react';

const initial = {
  rollNo: '',
  name: '',
  subjects: [
    { name: 'Subject A', mse: 0, ese: 0 },
    { name: 'Subject B', mse: 0, ese: 0 },
    { name: 'Subject C', mse: 0, ese: 0 },
    { name: 'Subject D', mse: 0, ese: 0 }
  ]
};

export default function StudentForm({ onSubmit, internalSaveButtonId }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setData({ ...data, [key]: value });
  }

  function updateSubject(i, key, value) {
    const s = data.subjects.map((sub, idx) => (idx === i ? { ...sub, [key]: Number(value) } : sub));
    setData({ ...data, subjects: s });
  }

  function calcFinal(sub) {
    const mse = Number(sub.mse) || 0;
    const ese = Number(sub.ese) || 0;
    return (mse * 0.30 + ese * 0.70).toFixed(2);
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    onSubmit(data);
    setTimeout(() => {
      setData(initial);
      setSaving(false);
    }, 300);
  }

  return (
    <form onSubmit={submit}>
      <div style={{marginBottom:12}}>
        <div className="label">Roll No</div>
        <input required className="input subject-name" value={data.rollNo} onChange={e => updateField('rollNo', e.target.value)} />
      </div>

      <div style={{marginBottom:12}}>
        <div className="label">Name</div>
        <input required className="input" value={data.name} onChange={e => updateField('name', e.target.value)} />
      </div>

      <div style={{marginBottom:12}}>
        <div className="label">Subjects (MSE & ESE out of 100)</div>
        <div className="subjects">
          {data.subjects.map((s, i) => (
            <div className="subject-row" key={i}>
              <input className="input subject-name" value={s.name} onChange={e => {
                const ss = data.subjects.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x);
                setData({ ...data, subjects: ss });
              }} placeholder="Subject name" />
              <input className="input" type="number" min="0" max="100" value={s.mse} onChange={e => updateSubject(i, 'mse', e.target.value)} />
              <input className="input" type="number" min="0" max="100" value={s.ese} onChange={e => updateSubject(i, 'ese', e.target.value)} />
              <div className="small">Final: {calcFinal(s)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button id={internalSaveButtonId} style={{display:'none'}} type="submit">Hidden Save</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button>
      </div>
    </form>
  );
}
