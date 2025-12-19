package com.annual.report.Service;

import com.annual.report.Entity.BudgetRecord;
import com.annual.report.Repository.BudgetRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetRecordService {

    @Autowired
    private BudgetRecordRepository repository;

    public List<BudgetRecord> getAllRecords() {
        return repository.findAll();
    }

    public Optional<BudgetRecord> getRecordById(Long id) {
        return repository.findById(id);
    }

    public BudgetRecord createRecord(BudgetRecord record) {
        return repository.save(record);
    }

    public BudgetRecord updateRecord(Long id, BudgetRecord recordDetails) {
        Optional<BudgetRecord> optionalRecord = repository.findById(id);
        if (optionalRecord.isPresent()) {
            BudgetRecord record = optionalRecord.get();
            record.setYear(recordDetails.getYear());
            record.setDept(recordDetails.getDept());
            record.setAllocated(recordDetails.getAllocated());
            record.setUtilized(recordDetails.getUtilized());
            record.setProject(recordDetails.getProject());
            return repository.save(record);
        }
        return null;
    }

    public boolean deleteRecord(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<BudgetRecord> searchRecords(Integer year, String dept, String searchTerm) {
        return repository.findByFilters(year, dept, searchTerm);
    }

    public List<Integer> getDistinctYears() {
        return repository.findDistinctYears();
    }

    public List<String> getDistinctDepts() {
        return repository.findDistinctDepts();
    }

    // Get summary statistics
    public BudgetSummary getSummary(List<BudgetRecord> records) {
        double totalAllocated = records.stream().mapToDouble(BudgetRecord::getAllocated).sum();
        double totalUtilized = records.stream().mapToDouble(BudgetRecord::getUtilized).sum();
        double remaining = totalAllocated - totalUtilized;
        double utilizationPercentage = totalAllocated > 0 ? (totalUtilized / totalAllocated) * 100 : 0;

        return new BudgetSummary(totalAllocated, totalUtilized, remaining, utilizationPercentage);
    }

    // Summary DTO
    public static class BudgetSummary {
        private final double totalAllocated;
        private final double totalUtilized;
        private final double remaining;
        private final double utilizationPercentage;

        public BudgetSummary(double totalAllocated, double totalUtilized, double remaining, double utilizationPercentage) {
            this.totalAllocated = totalAllocated;
            this.totalUtilized = totalUtilized;
            this.remaining = remaining;
            this.utilizationPercentage = utilizationPercentage;
        }

        // Getters
        public double getTotalAllocated() { return totalAllocated; }
        public double getTotalUtilized() { return totalUtilized; }
        public double getRemaining() { return remaining; }
        public double getUtilizationPercentage() { return utilizationPercentage; }
    }
}