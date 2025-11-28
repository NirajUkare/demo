import React, { useState } from 'react';

export default function EditModal({ student, onCancel, onSave }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(student)));
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

  function save() {
    setSaving(true);
    onSave(data.id || data._id, data);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="title-row">
          <h3>Edit Student</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn btn-danger" onClick={onCancel}>Cancel</button>
          </div>
        </div>
        <div>
          <div className="label">Roll No</div>
          <input className="input" value={data.rollNo} onChange={e => updateField('rollNo', e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <div className="label">Name</div>
          <input className="input" value={data.name} onChange={e => updateField('name', e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <div className="label">Subjects</div>
          {data.subjects.map((s, i) => (
            <div className="subject-row" key={i}>
              <input className="input" value={s.name} onChange={e => {
                const ss = data.subjects.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x);
                setData({ ...data, subjects: ss });
              }} />
              <input className="input" type="number" min="0" max="100" value={s.mse} onChange={e => updateSubject(i, 'mse', e.target.value)} />
              <input className="input" type="number" min="0" max="100" value={s.ese} onChange={e => updateSubject(i, 'ese', e.target.value)} />
              <div className="preview">Final: {calcFinal(s)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
