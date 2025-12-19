package com.annual.report.Service;

import com.annual.report.Entity.ResearchProject;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ResearchProjectService {

    // CRUD operations
    List<ResearchProject> getAllProjects();
    Optional<ResearchProject> getProjectById(Long id);
    ResearchProject createProject(ResearchProject project);
    ResearchProject updateProject(Long id, ResearchProject project);
    void deleteProject(Long id);

    // Search and filter operations
    List<ResearchProject> searchProjects(String searchTerm);
    List<ResearchProject> getProjectsByStatus(String status);
    List<ResearchProject> getProjectsByDomain(String domain);
    List<ResearchProject> getProjectsByYear(Integer year);

    // Analytics and statistics
    Map<String, Object> getResearchStatistics();
    Map<String, Long> getProjectCountByStatus();
    Map<String, Long> getProjectCountByYear();
    List<String> getAllResearchDomains();
    Double getTotalFunding();

    // Validation
    boolean isValidProject(ResearchProject project);
}
