package com.annual.report.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "budget_records")
public class BudgetRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Year is required")
    @Column(nullable = false)
    private Integer year;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String dept;

    @NotNull(message = "Allocated amount is required")
    @Min(value = 0, message = "Allocated amount must be positive")
    @Column(nullable = false)
    private Double allocated;

    @NotNull(message = "Utilized amount is required")
    @Min(value = 0, message = "Utilized amount must be positive")
    @Column(nullable = false)
    private Double utilized;

    @Column(name = "project_name")
    private String project;

    // Default constructor
    public BudgetRecord() {}

    // Parameterized constructor
    public BudgetRecord(Integer year, String dept, Double allocated, Double utilized, String project) {
        this.year = year;
        this.dept = dept;
        this.allocated = allocated;
        this.utilized = utilized;
        this.project = project;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }

    public Double getAllocated() { return allocated; }
    public void setAllocated(Double allocated) { this.allocated = allocated; }

    public Double getUtilized() { return utilized; }
    public void setUtilized(Double utilized) { this.utilized = utilized; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    // Utility method to calculate remaining amount
    @Transient
    public Double getRemaining() {
        return allocated - utilized;
    }
}