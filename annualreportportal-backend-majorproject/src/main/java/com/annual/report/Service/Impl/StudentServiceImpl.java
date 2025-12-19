package com.annual.report.Service.Impl;

import com.annual.report.Entity.Student;
import com.annual.report.Repository.StudentRepository;
import com.annual.report.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // for user create
    @Override
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    // for user Find all
    @Override
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }
    // for  delete user
    @Override
    public void deleteStudentById(Long id) {

        studentRepository.deleteById(id);

    }
}
