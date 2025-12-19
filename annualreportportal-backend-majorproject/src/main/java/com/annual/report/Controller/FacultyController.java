package com.annual.report.Controller;
import com.annual.report.Entity.Faculty;
import com.annual.report.Service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @PostMapping("/add")
    public ResponseEntity<Faculty> addFaculty(@RequestBody Faculty faculty) {
        Faculty faculty1 = facultyService.addFaculty(faculty);
        return   ResponseEntity.ok(faculty1);
    }

    @GetMapping("/all")
    public List<Faculty> getAllFaculty() {

        return facultyService.getAllFaculty();
    }

    @GetMapping("/by-role/{role}")
    public List<Faculty> getByRole(@PathVariable String role) {

        return facultyService.getByRole(role);
    }

    @GetMapping("/by-department/{department}")
    public List<Faculty> getByDepartment(@PathVariable String department) {
        return facultyService.getByDepartMent(department);
    }

    // Delete by database ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFaculty(@PathVariable Long id) {

         facultyService.DeleteFaculty(id);
        return ResponseEntity.ok("Faculty with id " + id + " deleted successfully.");
    }

    // Delete by generatedId (e.g., "CSE-1234")
    @DeleteMapping("/delete-by-generatedId/{generatedId}")
    public ResponseEntity<String> deleteFacultyByGeneratedId(@PathVariable String generatedId) {
        facultyService.DeleteByGeneratedId(generatedId);
        return ResponseEntity.ok("Faculty with generatedId " + generatedId + " deleted successfully.");
    }


    @PostMapping("/login")
    public ResponseEntity<String> facultyLogin(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String role,
            @RequestParam String department) {

        try {
            Faculty faculty = facultyService.facultyLogin(password, username, role, department);
            return ResponseEntity.ok("Login successful");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401).body(ex.getMessage());
        }
    }
}


