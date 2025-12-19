package com.annual.report.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "research_projects")
@Data
public class ResearchProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @NotBlank(message = "Project name is required")
    @Column(nullable = false)
    private String projectName;

    @NotBlank(message = "Principal investigator is required")
    @Column(nullable = false)
    private String principalInvestigator;

    @NotNull(message = "Publication year is required")
    @Min(value = 2000, message = "Publication year must be after 2000")
    @Max(value = 2030, message = "Publication year cannot be after 2030")
    @Column(nullable = false)
    private Integer publicationYear;

    @DecimalMin(value = "0.0", message = "Funding amount cannot be negative")
    private Double fundingAmount;

    private String researchDomain;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ongoing|completed", message = "Status must be either 'ongoing' or 'completed'")
    private String status;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructors
    public ResearchProject() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public ResearchProject(String projectName, String principalInvestigator,
                           Integer publicationYear, Double fundingAmount,
                           String researchDomain, String status) {
        this();
        this.projectName = projectName;
        this.principalInvestigator = principalInvestigator;
        this.publicationYear = publicationYear;
        this.fundingAmount = fundingAmount;
        this.researchDomain = researchDomain;
        this.status = status;
    }

    // PrePersist and PreUpdate methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}