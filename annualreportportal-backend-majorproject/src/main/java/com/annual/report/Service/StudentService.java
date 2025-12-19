package com.annual.report.Service;

import com.annual.report.Entity.Student;

import java.util.List;

public interface StudentService {

      Student createStudent(Student student);

      List<Student> getStudents();


       void deleteStudentById(Long id);

    }


