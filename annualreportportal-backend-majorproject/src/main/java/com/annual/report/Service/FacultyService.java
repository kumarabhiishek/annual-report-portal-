package com.annual.report.Service;

import com.annual.report.Entity.Faculty;

import java.time.LocalDate;
import java.util.List;

public interface FacultyService {

    Faculty addFaculty(Faculty faculty);

    List<Faculty> getAllFaculty();

    List<Faculty> getByRole(String role);

    List<Faculty> getByDepartMent(String department);

    void DeleteFaculty(Long id);


    void DeleteByGeneratedId(String  generatedId);

    Faculty facultyLogin(String password ,String  username, String role, String department);



}
