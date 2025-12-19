package com.annual.report.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;



@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    private Integer mid1 = 0;
    private Integer mid2 = 0;
    private Integer assignment = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonBackReference
    private Student student;

    // Constructors
    public Subject() {}

    public Subject(String subjectName, Integer mid1, Integer mid2, Integer assignment) {
        this.subjectName = subjectName;
        this.mid1 = mid1;
        this.mid2 = mid2;
        this.assignment = assignment;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Integer getMid1() { return mid1; }
    public void setMid1(Integer mid1) { this.mid1 = mid1; }

    public Integer getMid2() { return mid2; }
    public void setMid2(Integer mid2) { this.mid2 = mid2; }

    public Integer getAssignment() { return assignment; }
    public void setAssignment(Integer assignment) { this.assignment = assignment; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}