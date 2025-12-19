package com.annual.report.Repository;

import com.annual.report.Entity.ResearchProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResearchProjectRepository extends JpaRepository<ResearchProject, Long> {

    // Find projects by status
    List<ResearchProject> findByStatus(String status);

    // Find projects by research domain
    List<ResearchProject> findByResearchDomain(String researchDomain);

    // Find projects by principal investigator
    List<ResearchProject> findByPrincipalInvestigatorContainingIgnoreCase(String investigator);

    // Find projects by project name containing keyword
    List<ResearchProject> findByProjectNameContainingIgnoreCase(String projectName);

    // Find projects by publication year
    List<ResearchProject> findByPublicationYear(Integer publicationYear);

    // Custom query to get projects by multiple search criteria
    @Query("SELECT rp FROM ResearchProject rp WHERE " +
            "LOWER(rp.projectName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(rp.principalInvestigator) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(rp.researchDomain) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<ResearchProject> findBySearchTerm(String searchTerm);

    // Get distinct research domains
    @Query("SELECT DISTINCT rp.researchDomain FROM ResearchProject rp WHERE rp.researchDomain IS NOT NULL")
    List<String> findDistinctResearchDomains();

    // Get distinct principal investigators
    @Query("SELECT DISTINCT rp.principalInvestigator FROM ResearchProject rp")
    List<String> findDistinctPrincipalInvestigators();

    // Get project count by status
    @Query("SELECT rp.status, COUNT(rp) FROM ResearchProject rp GROUP BY rp.status")
    List<Object[]> countProjectsByStatus();

    // Get total funding amount
    @Query("SELECT COALESCE(SUM(rp.fundingAmount), 0) FROM ResearchProject rp")
    Double getTotalFundingAmount();
}
