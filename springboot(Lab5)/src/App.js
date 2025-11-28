import React, { useEffect, useState } from 'react';
import api from './api';
import StudentList from './components/StudentList';
import Toolbar from './components/Toolbar';
import EditModal from './components/EditModal';
import AddStudentModal from './components/AddStudentModal';

export default function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => fetchAll(), []);

  function fetchAll() {
    api.get('/students').then(r => setStudents(r.data)).catch(() => setStudents([]));
  }

  function handleCreate(student) {
    api.post('/students', student).then(() => {
      fetchAll();
      setAddOpen(false);
    });
  }

  function handleDelete(id) {
    api.delete(`/students/${id}`).then(() => fetchAll());
  }

  function handleEditOpen(student) {
    setEditing(student);
  }

  function handleEditSave(id, updated) {
    api.put(`/students/${id}`, updated).then(() => {
      setEditing(null);
      fetchAll();
    });
  }

  function handleEditCancel() {
    setEditing(null);
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header card">
          <h1>VIT Semester Result — 4 Subjects</h1>
          <div className="sub">MSE = 30% | ESE = 70% | D or below = FAIL | Overall >= 40 and grade A+/A/B/C = PASS</div>
        </header>

        <div className="top-area">
          <div className="top-left"></div>
          <div className="top-right card toolbar-wrap">
            <Toolbar students={students} onAdd={() => setAddOpen(true)} />
          </div>
        </div>

        <div className="center-wrap">
          <div className="card students-card">
            <h2 className="card-title">Students</h2>
            <StudentList students={students} onDelete={handleDelete} onEdit={handleEditOpen} />
          </div>
        </div>
      </div>

      {addOpen && <AddStudentModal onClose={() => setAddOpen(false)} onSave={handleCreate} />}
      {editing && <EditModal student={editing} onCancel={handleEditCancel} onSave={handleEditSave} />}
    </div>
  );
}
