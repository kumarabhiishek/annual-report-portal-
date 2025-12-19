package com.annual.report.Repository;

import com.annual.report.Entity.BudgetRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRecordRepository extends JpaRepository<BudgetRecord, Long> {

    // Find by department
    List<BudgetRecord> findByDept(String dept);

    // Find by year
    List<BudgetRecord> findByYear(Integer year);

    // Find by year and department
    List<BudgetRecord> findByYearAndDept(Integer year, String dept);

    // Search by project name containing keyword
    List<BudgetRecord> findByProjectContainingIgnoreCase(String project);

    // Search by department containing keyword
    List<BudgetRecord> findByDeptContainingIgnoreCase(String dept);

    // Custom query for complex search
    @Query("SELECT b FROM BudgetRecord b WHERE " +
            "(:year IS NULL OR b.year = :year) AND " +
            "(:dept IS NULL OR b.dept = :dept) AND " +
            "(:searchTerm IS NULL OR " +
            "LOWER(b.project) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.dept) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<BudgetRecord> findByFilters(@Param("year") Integer year,
                                     @Param("dept") String dept,
                                     @Param("searchTerm") String searchTerm);

    // Get distinct years for filter dropdown
    @Query("SELECT DISTINCT b.year FROM BudgetRecord b ORDER BY b.year DESC")
    List<Integer> findDistinctYears();

    // Get distinct departments for filter dropdown
    @Query("SELECT DISTINCT b.dept FROM BudgetRecord b ORDER BY b.dept")
    List<String> findDistinctDepts();
}