//package com.annual.report.Entity;
//
//import com.annual.report.Controller.HashMapConverter;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.util.Map;
//
//@Entity
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Table(name = "students")
//public class Student {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(nullable = false, unique = true)
//    private String rollNo;
//
//    @Column(nullable = false)
//    private Integer semester;
//
//    @Column(nullable = false)
//    private String session;
//
//    @Column(columnDefinition = "JSON")
//    @Convert(converter = HashMapConverter.class)
//    private Map<String, Map<String, Object>> subjects;
//
//
//}
//
//
//



package com.annual.report.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String rollNo;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private String session;

    private Integer training = 0;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Subject> subjects = new ArrayList<>();

    // Constructors
    public Student() {}

    public Student(String name, String rollNo, Integer semester, String session) {
        this.name = name;
        this.rollNo = rollNo;
        this.semester = semester;
        this.session = session;
    }

    // Helper method to add subject
    public void addSubject(Subject subject) {
        subjects.add(subject);
        subject.setStudent(this);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getSession() { return session; }
    public void setSession(String session) { this.session = session; }

    public Integer getTraining() { return training; }
    public void setTraining(Integer training) { this.training = training; }

    public List<Subject> getSubjects() { return subjects; }
    public void setSubjects(List<Subject> subjects) {
        if (subjects != null) {
            this.subjects.clear();
            this.subjects.addAll(subjects);
            for (Subject subject : subjects) {
                subject.setStudent(this);
            }
        }
    }
}