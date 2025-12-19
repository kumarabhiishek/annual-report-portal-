package com.annual.report.Controller;

import com.annual.report.Entity.ResearchProject;
import com.annual.report.Service.ResearchProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/research")
public class ResearchProjectController {

    @Autowired
    private ResearchProjectService researchProjectService;

    // Get all projects
    @GetMapping("/projects")
    public ResponseEntity<List<ResearchProject>> getAllProjects() {
        try {
            List<ResearchProject> projects = researchProjectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get project by ID
    @GetMapping("/projects/{id}")
    public ResponseEntity<ResearchProject> getProjectById(@PathVariable Long id) {
        try {
            Optional<ResearchProject> project = researchProjectService.getProjectById(id);
            return project.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new project
    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@Valid @RequestBody ResearchProject project) {
        try {
            ResearchProject createdProject = researchProjectService.createProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create project"));
        }
    }

    // Update project
    @PutMapping("/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @Valid @RequestBody ResearchProject project) {
        try {
            ResearchProject updatedProject = researchProjectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update project"));
        }
    }

    // Delete project
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            researchProjectService.deleteProject(id);
            return ResponseEntity.ok().body(Map.of("message", "Project deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete project"));
        }
    }

    // Search projects
    @GetMapping("/projects/search")
    public ResponseEntity<List<ResearchProject>> searchProjects(@RequestParam(required = false) String q) {
        try {
            List<ResearchProject> projects = researchProjectService.searchProjects(q);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get projects by status
    @GetMapping("/projects/status/{status}")
    public ResponseEntity<List<ResearchProject>> getProjectsByStatus(@PathVariable String status) {
        try {
            List<ResearchProject> projects = researchProjectService.getProjectsByStatus(status);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get research statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getResearchStatistics() {
        try {
            Map<String, Object> statistics = researchProjectService.getResearchStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all research domains
    @GetMapping("/domains")
    public ResponseEntity<List<String>> getAllDomains() {
        try {
            List<String> domains = researchProjectService.getAllResearchDomains();
            return ResponseEntity.ok(domains);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "Research Management API is running"));
    }
}