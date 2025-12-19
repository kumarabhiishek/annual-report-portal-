package com.annual.report.Repository;

//
//import com.annual.report.Entity.Student;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface StudentRepository extends JpaRepository<Student, Long> {
//    List<Student> findBySemester(Integer semester);
//    List<Student> findBySemesterAndSession(Integer semester, String session);
//    List<Student> findBySession(String session);
//    boolean existsByRollNo(String rollNo);
//}










import com.annual.report.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNo(String rollNo);

    Optional<Student> findByRollNo(String rollNo);

    // Use JOIN FETCH to avoid N+1 query problem
    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.subjects ORDER BY s.semester, s.rollNo")
    List<Student> findAllWithSubjects();

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.subjects WHERE s.semester = :semester ORDER BY s.rollNo")
    List<Student> findBySemesterWithSubjects(@Param("semester") Integer semester);

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.subjects WHERE s.semester = :semester AND s.session = :session ORDER BY s.rollNo")
    List<Student> findBySemesterAndSessionWithSubjects(@Param("semester") Integer semester, @Param("session") String session);

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.subjects WHERE s.session = :session ORDER BY s.semester, s.rollNo")
    List<Student> findBySessionWithSubjects(@Param("session") String session);

    List<Student> findBySemester(Integer semester);
    List<Student> findBySession(String session);
    List<Student> findBySemesterAndSession(Integer semester, String session);
}

