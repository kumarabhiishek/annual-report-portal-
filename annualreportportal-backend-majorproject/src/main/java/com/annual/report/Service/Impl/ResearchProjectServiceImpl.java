package com.annual.report.Service.Impl;

import com.annual.report.Entity.ResearchProject;
import com.annual.report.Repository.ResearchProjectRepository;
import com.annual.report.Service.ResearchProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResearchProjectServiceImpl implements ResearchProjectService {

    @Autowired
    private ResearchProjectRepository researchProjectRepository;

    @Override
    public List<ResearchProject> getAllProjects() {
        return researchProjectRepository.findAll();
    }

    @Override
    public Optional<ResearchProject> getProjectById(Long id) {
        return researchProjectRepository.findById(id);
    }

    @Override
    public ResearchProject createProject(ResearchProject project) {
        if (!isValidProject(project)) {
            throw new IllegalArgumentException("Invalid project data");
        }
        return researchProjectRepository.save(project);
    }

    @Override
    public ResearchProject updateProject(Long id, ResearchProject project) {
        Optional<ResearchProject> existingProject = researchProjectRepository.findById(id);
        if (existingProject.isPresent()) {
            ResearchProject updatedProject = existingProject.get();
            updatedProject.setProjectName(project.getProjectName());
            updatedProject.setPrincipalInvestigator(project.getPrincipalInvestigator());
            updatedProject.setPublicationYear(project.getPublicationYear());
            updatedProject.setFundingAmount(project.getFundingAmount());
            updatedProject.setResearchDomain(project.getResearchDomain());
            updatedProject.setStatus(project.getStatus());
            return researchProjectRepository.save(updatedProject);
        }
        throw new RuntimeException("Project not found with id: " + id);
    }

    @Override
    public void deleteProject(Long id) {
        if (researchProjectRepository.existsById(id)) {
            researchProjectRepository.deleteById(id);
        } else {
            throw new RuntimeException("Project not found with id: " + id);
        }
    }

    @Override
    public List<ResearchProject> searchProjects(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllProjects();
        }
        return researchProjectRepository.findBySearchTerm(searchTerm.trim());
    }

    @Override
    public List<ResearchProject> getProjectsByStatus(String status) {
        return researchProjectRepository.findByStatus(status);
    }

    @Override
    public List<ResearchProject> getProjectsByDomain(String domain) {
        return researchProjectRepository.findByResearchDomain(domain);
    }

    @Override
    public List<ResearchProject> getProjectsByYear(Integer year) {
        return researchProjectRepository.findByPublicationYear(year);
    }

    @Override
    public Map<String, Object> getResearchStatistics() {
        Map<String, Object> stats = new HashMap<>();

        List<ResearchProject> allProjects = getAllProjects();

        // Basic counts
        stats.put("totalProjects", (long) allProjects.size());
        stats.put("ongoingProjects", allProjects.stream()
                .filter(p -> "ongoing".equals(p.getStatus()))
                .count());
        stats.put("completedProjects", allProjects.stream()
                .filter(p -> "completed".equals(p.getStatus()))
                .count());

        // Funding statistics
        Double totalFunding = getTotalFunding();
        stats.put("totalFunding", totalFunding);

        // Domain statistics
        Map<String, Long> domainCounts = allProjects.stream()
                .filter(p -> p.getResearchDomain() != null)
                .collect(Collectors.groupingBy(
                        ResearchProject::getResearchDomain,
                        Collectors.counting()
                ));
        stats.put("projectsByDomain", domainCounts);

        // Year statistics
        Map<Integer, Long> yearCounts = allProjects.stream()
                .collect(Collectors.groupingBy(
                        ResearchProject::getPublicationYear,
                        Collectors.counting()
                ));
        stats.put("projectsByYear", yearCounts);

        // Unique counts
        stats.put("uniqueDomains", getAllResearchDomains().size());
        stats.put("uniqueInvestigators", researchProjectRepository.findDistinctPrincipalInvestigators().size());

        return stats;
    }

    @Override
    public Map<String, Long> getProjectCountByStatus() {
        List<Object[]> statusCounts = researchProjectRepository.countProjectsByStatus();
        return statusCounts.stream()
                .collect(Collectors.toMap(
                        obj -> (String) obj[0],
                        obj -> (Long) obj[1]
                ));
    }

    @Override
    public Map<String, Long> getProjectCountByYear() {
        List<ResearchProject> projects = getAllProjects();
        return projects.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getPublicationYear().toString(),
                        Collectors.counting()
                ));
    }

    @Override
    public List<String> getAllResearchDomains() {
        return researchProjectRepository.findDistinctResearchDomains();
    }

    @Override
    public Double getTotalFunding() {
        return researchProjectRepository.getTotalFundingAmount();
    }

    @Override
    public boolean isValidProject(ResearchProject project) {
        return project != null &&
                project.getProjectName() != null && !project.getProjectName().trim().isEmpty() &&
                project.getPrincipalInvestigator() != null && !project.getPrincipalInvestigator().trim().isEmpty() &&
                project.getPublicationYear() != null &&
                project.getStatus() != null && ("ongoing".equals(project.getStatus()) || "completed".equals(project.getStatus()));
    }

}
