import React from 'react';
import StudentCard from './StudentCard';

function computeFinal(sub) {
  const mse = Number(sub.mse) || 0;
  const ese = Number(sub.ese) || 0;
  return +(mse * 0.30 + ese * 0.70).toFixed(2);
}

function calcGrade(p) {
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B';
  if (p >= 60) return 'C';
  if (p >= 50) return 'D';
  return 'F';
}

function calcStatus(overall, grade) {
  if (overall < 40) return 'FAIL';
  if (grade === 'D' || grade === 'F') return 'FAIL';
  return 'PASS';
}

export default function StudentList({ students = [], onDelete, onEdit }) {
  return (
    <div className="table-wrap" id="students-table">
      <table>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Subjects (final)</th>
            <th>%</th>
            <th>Grade</th>
            <th>Status</th>
            <th style={{minWidth:140}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && <tr><td colSpan="7" className="small">No students yet</td></tr>}
          {students.map(s => {
            const finals = s.subjects.map(sub => computeFinal(sub));
            const overall = finals.length ? (finals.reduce((a,b) => a + b, 0) / finals.length) : 0;
            const grade = calcGrade(overall);
            const status = calcStatus(overall, grade);
            return (
              <StudentCard key={s.id} student={s} finals={finals} overall={overall} grade={grade} status={status} onDelete={onDelete} onEdit={onEdit} />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
