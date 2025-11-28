import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

function downloadCSV(students) {
  const header = ['Roll No','Name','Subject 1','Sub1 Final','Subject 2','Sub2 Final','Subject 3','Sub3 Final','Subject 4','Sub4 Final','Overall %','Grade','Status'];
  const rows = students.map(s => {
    const finals = s.subjects.map(sub => (sub.mse*0.30 + sub.ese*0.70).toFixed(2));
    const overall = finals.reduce((a,b)=>a+Number(b),0) / finals.length;
    const grade = calcGrade(overall);
    const status = calcStatus(overall, grade);
    return [
      s.rollNo,
      s.name,
      s.subjects[0]?.name || '',
      finals[0] || '',
      s.subjects[1]?.name || '',
      finals[1] || '',
      s.subjects[2]?.name || '',
      finals[2] || '',
      s.subjects[3]?.name || '',
      finals[3] || '',
      Number(overall).toFixed(2),
      grade,
      status
    ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
  });

  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', 'vit_results.csv');
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function downloadPDF() {
  const el = document.getElementById('students-table');
  if (!el) return alert('No table to export');

  const clone = el.cloneNode(true);
  const table = clone.querySelector('table');
  if (!table) return alert('Table structure not found');

  const thead = table.querySelector('thead');
  if (thead) {
    const ths = thead.querySelectorAll('th');
    if (ths.length > 0) ths[ths.length - 1].remove();
  }

  const tbody = table.querySelector('tbody');
  if (tbody) {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) cells[cells.length - 1].remove();
    });
  }

  const wrap = document.createElement('div');
  wrap.style.position = 'fixed';
  wrap.style.left = '-10000px';
  wrap.style.top = '0';
  wrap.style.background = 'white';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  try {
    const canvas = await html2canvas(clone, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth - 40, pdfHeight);
    pdf.save('vit_results.pdf');
  } catch (err) {
    console.error(err);
    alert('PDF export failed');
  } finally {
    document.body.removeChild(wrap);
  }
}

export default function Toolbar({ students = [], onAdd }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div className="toolbar-left">
        <div className="small">Total students: <strong>{students.length}</strong></div>
      </div>
      <div className="toolbar-right" style={{display:'flex',gap:8,alignItems:'center'}}>
        <button className="export-btn" onClick={() => downloadCSV(students)}>Download CSV</button>
        <button className="export-btn" onClick={() => downloadPDF()}>Download PDF</button>
        <button className="btn" onClick={onAdd}>Add Student Details</button>
      </div>
    </div>
  );
}
