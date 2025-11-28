import React from 'react';

export default function StudentCard({ student, finals, overall, grade, status, onDelete, onEdit }) {
  return (
    <tr>
      <td>{student.rollNo}</td>
      <td>{student.name}</td>
      <td>
        {student.subjects.map((sub, i) => (
          <div key={i} className="small">{sub.name}: {Number(finals[i]).toFixed(2)}</div>
        ))}
      </td>
      <td>{Number(overall).toFixed(2)}</td>
      <td>{grade}</td>
      <td><span className={`tag ${status === 'PASS' ? 'pass' : 'fail'}`}>{status}</span></td>
      <td>
        <div className="actions">
          <button className="btn secondary" onClick={() => onEdit(student)}>Edit</button>
          <button className="btn danger" onClick={() => onDelete(student.id)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}
