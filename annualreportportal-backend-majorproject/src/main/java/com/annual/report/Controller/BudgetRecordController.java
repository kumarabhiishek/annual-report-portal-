package com.annual.report.Controller;
import com.annual.report.Entity.BudgetRecord;
import com.annual.report.Service.BudgetRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/budget")
public class BudgetRecordController {

    @Autowired
    private BudgetRecordService budgetRecordService;

    // Get all records
    @GetMapping
    public List<BudgetRecord> getAllRecords() {
        return budgetRecordService.getAllRecords();
    }

    // Get record by ID
    @GetMapping("/{id}")
    public ResponseEntity<BudgetRecord> getRecordById(@PathVariable Long id) {
        Optional<BudgetRecord> record = budgetRecordService.getRecordById(id);
        return record.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new record
    @PostMapping
    public BudgetRecord createRecord(@Valid @RequestBody BudgetRecord record) {
        return budgetRecordService.createRecord(record);
    }

    // Update record
    @PutMapping("/{id}")
    public ResponseEntity<BudgetRecord> updateRecord(@PathVariable Long id,
                                                     @Valid @RequestBody BudgetRecord recordDetails) {
        BudgetRecord updatedRecord = budgetRecordService.updateRecord(id, recordDetails);
        return updatedRecord != null ? ResponseEntity.ok(updatedRecord) : ResponseEntity.notFound().build();
    }

    // Delete record
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteRecord(@PathVariable Long id) {
        boolean deleted = budgetRecordService.deleteRecord(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        return deleted ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    // Search records with filters
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRecords(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String dept,
            @RequestParam(required = false) String searchTerm) {

        List<BudgetRecord> records = budgetRecordService.searchRecords(year, dept, searchTerm);
        BudgetRecordService.BudgetSummary summary = budgetRecordService.getSummary(records);

        Map<String, Object> response = new HashMap<>();
        response.put("records", records);
        response.put("summary", summary);
        response.put("filters", Map.of(
                "availableYears", budgetRecordService.getDistinctYears(),
                "availableDepts", budgetRecordService.getDistinctDepts()
        ));

        return ResponseEntity.ok(response);
    }

    // Get summary only
    @GetMapping("/summary")
    public BudgetRecordService.BudgetSummary getSummary() {
        List<BudgetRecord> allRecords = budgetRecordService.getAllRecords();
        return budgetRecordService.getSummary(allRecords);
    }

    // Get available filters
    @GetMapping("/filters")
    public Map<String, Object> getAvailableFilters() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("years", budgetRecordService.getDistinctYears());
        filters.put("departments", budgetRecordService.getDistinctDepts());
        return filters;
    }
}