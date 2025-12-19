package com.annual.report.Service.Impl;
import com.annual.report.Entity.Faculty;
import com.annual.report.Repository.FacultyRepository;
import com.annual.report.Service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
@Service
public class FacultyImpl implements FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public Faculty addFaculty(Faculty faculty) {

        String deptCode = faculty.getDepartment() != null && faculty.getDepartment().length() >= 3
                ? faculty.getDepartment().substring(0, 3).toUpperCase()
                : faculty.getDepartment().toUpperCase();
        int randomNum = 1000 + new Random().nextInt(9000);
        String generatedId = deptCode + "-" + randomNum;
        faculty.setGeneratedId(generatedId);
        faculty.setDateAdded(LocalDate.now());
        Faculty savedFaculty = facultyRepository.save(faculty);
        return savedFaculty;
    }

    @Override
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Override
    public List<Faculty> getByRole(String role) {
        return facultyRepository.findByRole(role);
    }

    @Override
    public List<Faculty> getByDepartMent(String department) {
        return facultyRepository.findByDepartment(department);
    }

    @Override
    public void DeleteFaculty(Long id) {


        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Faculty with id " + id + " does not exist.");
        }
        facultyRepository.deleteById(id);
    }

    @Override
    public void DeleteByGeneratedId(String  generatedId) {

        Faculty faculty = facultyRepository.findByGeneratedId(generatedId);
        if (faculty == null) {
           // return ResponseEntity.notFound().build();
            throw  new RuntimeException("Faculty with id " + generatedId + " not found.");
        }
        facultyRepository.delete(faculty);
    }

    @Override
    public Faculty facultyLogin(String password , String username, String role, String department) {

        Faculty faculty = facultyRepository.findByEmailAndRoleAndDepartment(username, role, department);
        if (faculty == null) {
            throw new RuntimeException("Faculty with email " + username + " not found.");
        }

        if (!faculty.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password.");
        }
        return faculty;
    }
}
