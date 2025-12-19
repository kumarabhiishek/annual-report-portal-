package com.annual.report.Repository;


import com.annual.report.Entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    List<Faculty> findByRole(String role);
    List<Faculty> findByDepartment(String department);
    Faculty findByGeneratedId(String generatedId);
    Faculty findByEmailAndRoleAndDepartment(String email, String role, String department);
}
