//package com.annual.report.Controller;
//
//import com.annual.report.Entity.Student;
//import com.annual.report.Repository.StudentRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import java.io.InputStreamReader;
//import java.util.*;
//import com.opencsv.CSVReader;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//@RestController
//@RequestMapping("/students")
//@CrossOrigin(origins = "http://localhost:5173")
//public class StudentController {
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
//
//    @PostMapping("/upload")
//    public ResponseEntity<Map<String, Object>> uploadStudents(@RequestParam("file") MultipartFile file) {
//        try {
//            if (file.isEmpty()) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "File is empty"
//                ));
//            }
//
//            if (!file.getOriginalFilename().endsWith(".csv")) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "Only CSV files are allowed"
//                ));
//            }
//
//            List<Student> students = parseCSV(file);
//            if (students.isEmpty()) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "No valid student data found in CSV"
//                ));
//            }
//
//            // Check for duplicate roll numbers and save valid students
//            List<Student> validStudents = new ArrayList<>();
//            String session = students.get(0).getSession();
//
//            for (Student student : students) {
//                if (!studentRepository.existsByRollNo(student.getRollNo())) {
//                    validStudents.add(student);
//                } else {
//                    logger.warn("Skipping duplicate roll number: {}", student.getRollNo());
//                }
//            }
//
//            if (validStudents.isEmpty()) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "All students already exist in database"
//                ));
//            }
//
//            studentRepository.saveAll(validStudents);
//
//            return ResponseEntity.ok().body(Map.of(
//                    "success", true,
//                    "message", "CSV uploaded successfully",
//                    "session", session,
//                    "count", validStudents.size()
//            ));
//
//        } catch (Exception e) {
//            logger.error("CSV Upload Failed", e);
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "message", "Error processing CSV: " + e.getMessage()
//            ));
//        }
//    }
//
//    private List<Student> parseCSV(MultipartFile file) throws Exception {
//        List<Student> students = new ArrayList<>();
//        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
//
//            String[] header = csvReader.readNext();  // Read header first
//
//            if (header == null || header.length < 5) {
//                return students; // Not enough columns
//            }
//
//            String[] nextLine;
//            while ((nextLine = csvReader.readNext()) != null) {
//                if (nextLine.length < 4) continue; // Not enough data
//
//                try {
//                    Student student = new Student();
//                    student.setName(nextLine[0].trim());
//                    student.setRollNo(nextLine[1].trim());
//                    student.setSemester(Integer.parseInt(nextLine[2].trim()));
//                    student.setSession(nextLine[3].trim());
//
//                    // Parse subjects data (columns 4+)
//                    Map<String, Map<String, Object>> subjects = new HashMap<>();
//
//                    for (int i = 4; i < nextLine.length && i < header.length; i++) {
//                        String headerName = header[i].trim();
//                        String value = nextLine[i].trim();
//
//                        if (!value.isEmpty()) {
//                            // Parse subject header format: subjects.BT-101 - Engineering Chemistry.mid1
//                            String[] headerParts = headerName.split("\\.");
//                            if (headerParts.length >= 3) {
//                                String subjectName = headerParts[1]; // e.g., "BT-101 - Engineering Chemistry"
//                                String fieldName = headerParts[2];   // e.g., "mid1", "mid2", etc.
//
//                                if (!subjects.containsKey(subjectName)) {
//                                    subjects.put(subjectName, new HashMap<>());
//                                }
//
//                                // Convert numeric values
//                                if (fieldName.equals("mid1") || fieldName.equals("mid2") ||
//                                        fieldName.equals("training") || fieldName.equals("final")) {
//                                    try {
//                                        subjects.get(subjectName).put(fieldName, Integer.parseInt(value));
//                                    } catch (NumberFormatException e) {
//                                        subjects.get(subjectName).put(fieldName, 0);
//                                    }
//                                } else {
//                                    subjects.get(subjectName).put(fieldName, value);
//                                }
//                            }
//                        }
//                    }
//
//                    student.setSubjects(subjects);
//                    students.add(student);
//                } catch (Exception e) {
//                    logger.warn("Skipping invalid row: " + Arrays.toString(nextLine), e);
//                }
//            }
//        }
//        return students;
//    }
//
//    @GetMapping
//    public List<Student> getAllStudents() {
//        return studentRepository.findAll();
//    }
//
//    @GetMapping("/semester/{semester}")
//    public List<Student> getStudentsBySemester(@PathVariable Integer semester) {
//        return studentRepository.findBySemester(semester);
//    }
//
//    @GetMapping("/semester/{semester}/session/{session}")
//    public List<Student> getStudentsBySemesterAndSession(
//            @PathVariable Integer semester,
//            @PathVariable String session) {
//        return studentRepository.findBySemesterAndSession(semester, session);
//    }
//
//    @GetMapping("/session/{session}")
//    public List<Student> getStudentsBySession(@PathVariable String session) {
//        return studentRepository.findBySession(session);
//    }
//
//    @PostMapping
//    public ResponseEntity<?> addStudent(@RequestBody Student student) {
//        try {
//            // Check if roll number already exists
//            if (studentRepository.existsByRollNo(student.getRollNo())) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "Student with this roll number already exists"
//                ));
//            }
//
//            Student savedStudent = studentRepository.save(student);
//            return ResponseEntity.ok(savedStudent);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "message", "Error adding student: " + e.getMessage()
//            ));
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
//        try {
//            if (studentRepository.existsById(id)) {
//                studentRepository.deleteById(id);
//                return ResponseEntity.noContent().build();
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//}




package com.annual.report.Controller;

import com.annual.report.Entity.Student;
import com.annual.report.Entity.Subject;
import com.annual.report.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStreamReader;
import java.util.*;
import com.opencsv.CSVReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadStudents(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "File is empty"
                ));
            }

            if (!file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Only CSV files are allowed"
                ));
            }

            List<Student> students = parseCSV(file);
            if (students.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "No valid student data found in CSV"
                ));
            }

            // Check for duplicate roll numbers and save valid students
            List<Student> validStudents = new ArrayList<>();
            String session = students.get(0).getSession();

            for (Student student : students) {
                if (!studentRepository.existsByRollNo(student.getRollNo())) {
                    // Ensure subjects are properly linked to student
                    if (student.getSubjects() != null) {
                        for (Subject subject : student.getSubjects()) {
                            subject.setStudent(student);
                        }
                    }
                    validStudents.add(student);
                } else {
                    logger.warn("Skipping duplicate roll number: {}", student.getRollNo());
                }
            }

            if (validStudents.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "All students already exist in database"
                ));
            }

            studentRepository.saveAll(validStudents);

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "CSV uploaded successfully",
                    "session", session,
                    "count", validStudents.size()
            ));

        } catch (Exception e) {
            logger.error("CSV Upload Failed", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Error processing CSV: " + e.getMessage()
            ));
        }
    }

    private List<Student> parseCSV(MultipartFile file) throws Exception {
        List<Student> students = new ArrayList<>();
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {

            String[] header = csvReader.readNext();
            if (header == null || header.length < 5) {
                logger.warn("CSV header has insufficient columns: {}", Arrays.toString(header));
                return students;
            }

            logger.info("CSV Header: {}", Arrays.toString(header));

            String[] nextLine;
            int rowNumber = 1;
            while ((nextLine = csvReader.readNext()) != null) {
                rowNumber++;

                if (nextLine.length < 5) {
                    logger.warn("Skipping row {}: insufficient columns", rowNumber);
                    continue;
                }

                try {
                    Student student = new Student();
                    student.setName(nextLine[0].trim());
                    student.setRollNo(nextLine[1].trim());
                    student.setSemester(Integer.parseInt(nextLine[2].trim()));
                    student.setSession(nextLine[3].trim());

                    // Parse training marks
                    if (nextLine.length > 4 && !nextLine[4].trim().isEmpty()) {
                        try {
                            student.setTraining(Integer.parseInt(nextLine[4].trim()));
                        } catch (NumberFormatException e) {
                            student.setTraining(0);
                            logger.warn("Invalid training marks for student {}, defaulting to 0", nextLine[1]);
                        }
                    } else {
                        student.setTraining(0);
                    }

                    // Parse subjects data
                    List<Subject> subjects = parseSubjects(header, nextLine, student);
                    student.setSubjects(subjects);

                    students.add(student);

                    logger.info("Parsed student: {} - {} - Training: {} - Subjects: {}",
                            student.getName(), student.getRollNo(), student.getTraining(),
                            subjects != null ? subjects.size() : 0);

                } catch (Exception e) {
                    logger.warn("Skipping invalid row {}: {}", rowNumber, Arrays.toString(nextLine), e);
                }
            }
        }
        logger.info("Total students parsed: {}", students.size());
        return students;
    }

    private List<Subject> parseSubjects(String[] header, String[] row, Student student) {
        List<Subject> subjects = new ArrayList<>();
        Map<String, Subject> subjectMap = new HashMap<>();

        for (int i = 5; i < row.length && i < header.length; i++) {
            String headerName = header[i].trim();
            String value = row[i].trim();

            if (value.isEmpty()) {
                continue;
            }

            try {
                // Expected header format: "Mathematics.mid1", "Physics.assignment", etc.
                String[] parts = headerName.split("\\.");
                if (parts.length == 2) {
                    String subjectName = parts[0].trim();
                    String fieldType = parts[1].trim().toLowerCase();

                    Subject subject = subjectMap.get(subjectName);
                    if (subject == null) {
                        subject = new Subject();
                        subject.setSubjectName(subjectName);
                        subject.setStudent(student);
                        subjectMap.put(subjectName, subject);
                    }

                    int marksValue = Integer.parseInt(value);
                    switch (fieldType) {
                        case "mid1":
                            subject.setMid1(marksValue);
                            break;
                        case "mid2":
                            subject.setMid2(marksValue);
                            break;
                        case "assignment":
                            subject.setAssignment(marksValue);
                            break;
                        default:
                            logger.warn("Unknown field type '{}' in header '{}'", fieldType, headerName);
                    }
                } else {
                    logger.warn("Invalid header format: {}, expected format: SubjectName.fieldType", headerName);
                }
            } catch (NumberFormatException e) {
                logger.warn("Invalid marks value '{}' for header '{}'", value, headerName);
            } catch (Exception e) {
                logger.warn("Error parsing subject data for header '{}': {}", headerName, e.getMessage());
            }
        }

        subjects.addAll(subjectMap.values());
        logger.debug("Parsed {} subjects for student {}", subjects.size(), student.getRollNo());
        return subjects;
    }

    // Repository methods
    @GetMapping
    public List<Student> getAllStudents() {
        List<Student> students = studentRepository.findAllWithSubjects();
        students.forEach(student -> {
            if (student.getTraining() == null) student.setTraining(0);
            if (student.getSubjects() == null) student.setSubjects(new ArrayList<>());
        });
        return students;
    }

    @GetMapping("/semester/{semester}")
    public List<Student> getStudentsBySemester(@PathVariable Integer semester) {
        List<Student> students = studentRepository.findBySemesterWithSubjects(semester);
        students.forEach(student -> {
            if (student.getTraining() == null) student.setTraining(0);
            if (student.getSubjects() == null) student.setSubjects(new ArrayList<>());
        });
        return students;
    }

    @GetMapping("/semester/{semester}/session/{session}")
    public List<Student> getStudentsBySemesterAndSession(
            @PathVariable Integer semester,
            @PathVariable String session) {
        List<Student> students = studentRepository.findBySemesterAndSessionWithSubjects(semester, session);
        students.forEach(student -> {
            if (student.getTraining() == null) student.setTraining(0);
            if (student.getSubjects() == null) student.setSubjects(new ArrayList<>());
        });
        return students;
    }

    @GetMapping("/session/{session}")
    public List<Student> getStudentsBySession(@PathVariable String session) {
        List<Student> students = studentRepository.findBySessionWithSubjects(session);
        students.forEach(student -> {
            if (student.getTraining() == null) student.setTraining(0);
            if (student.getSubjects() == null) student.setSubjects(new ArrayList<>());
        });
        return students;
    }

    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        try {
            if (studentRepository.existsByRollNo(student.getRollNo())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Student with this roll number already exists"
                ));
            }

            if (student.getTraining() == null) {
                student.setTraining(0);
            }

            // Ensure subjects have proper relationship with student
            if (student.getSubjects() != null) {
                for (Subject subject : student.getSubjects()) {
                    subject.setStudent(student);
                    if (subject.getMid1() == null) subject.setMid1(0);
                    if (subject.getMid2() == null) subject.setMid2(0);
                    if (subject.getAssignment() == null) subject.setAssignment(0);
                }
            } else {
                student.setSubjects(new ArrayList<>());
            }

            Student savedStudent = studentRepository.save(student);

            logger.info("Added student: {} - {} - Training: {} - Subjects: {}",
                    savedStudent.getName(), savedStudent.getRollNo(), savedStudent.getTraining(),
                    savedStudent.getSubjects().size());

            return ResponseEntity.ok(savedStudent);
        } catch (Exception e) {
            logger.error("Error adding student", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Error adding student: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            if (studentRepository.existsById(id)) {
                studentRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting student with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
