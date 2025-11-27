package com.example.VIT_exam_result.service;

import com.example.VIT_exam_result.models.Student;
import com.example.VIT_exam_result.models.SubjectMark;
import com.example.VIT_exam_result.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> findAll() {
        return repo.findAll();
    }

    public Optional<Student> findById(String id) {
        return repo.findById(id);
    }

    public Student save(Student student) {
        computeStudent(student);
        return repo.save(student);
    }

    public Student update(String id, Student student) {
        student.setId(id);
        computeStudent(student);
        return repo.save(student);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    private void computeStudent(Student s) {
        if (s.getSubjects() == null || s.getSubjects().isEmpty()) {
            s.setOverallPercentage(0.0);
            s.setGrade("F");
            s.setStatus("FAIL");
            return;
        }
        double sum = 0.0;
        boolean allPass = true;
        for (SubjectMark m : s.getSubjects()) {
            double mse = m.getMse() == null ? 0.0 : m.getMse();
            double ese = m.getEse() == null ? 0.0 : m.getEse();
            double finalMark = mse * 0.30 + ese * 0.70;
            m.setFinalMark(finalMark);
            sum += finalMark;
            if (finalMark < 40.0) allPass = false;
        }
        double overall = sum / s.getSubjects().size();
        s.setOverallPercentage(Math.round(overall * 100.0) / 100.0);
        s.setGrade(calcGrade(overall));
        s.setStatus(allPass ? "PASS" : "FAIL");
    }

    private String calcGrade(double p) {
        if (p >= 90) return "A+";
        if (p >= 80) return "A";
        if (p >= 70) return "B";
        if (p >= 60) return "C";
        if (p >= 50) return "D";
        return "F";
    }
}
