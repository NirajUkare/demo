import React from 'react';
import StudentForm from './StudentForm';

export default function AddStudentModal({ onClose, onSave }) {
  function handleSubmit(data) {
    onSave(data);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h3 style={{margin:0}}>Add Student Details</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={() => document.getElementById('add-form-save')?.click()}>Save</button>
            <button className="btn danger" onClick={onClose}>Close</button>
          </div>
        </div>
        <StudentForm onSubmit={handleSubmit} internalSaveButtonId="add-form-save" />
      </div>
    </div>
  );
}
