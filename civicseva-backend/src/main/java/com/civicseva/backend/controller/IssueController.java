package com.civicseva.backend.controller;

import com.civicseva.backend.dto.CreateIssueDto;
import com.civicseva.backend.dto.IssueDto;
import com.civicseva.backend.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping
    public ResponseEntity<List<IssueDto>> getAllIssues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department) {

        List<IssueDto> issues;

        if (status != null) {
            issues = issueService.getIssuesByStatus(status);
        } else if (category != null) {
            issues = issueService.getIssuesByCategory(category);
        } else if (department != null) {
            issues = issueService.getIssuesByDepartment(department);
        } else {
            issues = issueService.getAllIssues();
        }

        return ResponseEntity.ok(issues);
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<IssueDto> getIssueById(@PathVariable String issueId) {
        Optional<IssueDto> issue = issueService.getIssueById(issueId);
        return issue.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<IssueDto>> getIssuesNearLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5.0") Double radiusKm) {

        List<IssueDto> issues = issueService.getIssuesNearLocation(latitude, longitude, radiusKm);
        return ResponseEntity.ok(issues);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createIssue(@Valid @RequestBody CreateIssueDto createIssueDto) {
        try {
            IssueDto createdIssue = issueService.createIssue(createIssueDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Issue reported successfully!");
            response.put("issue", createdIssue);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/{issueId}")
    public ResponseEntity<Map<String, Object>> updateIssue(
            @PathVariable String issueId,
            @Valid @RequestBody CreateIssueDto updateDto) {

        try {
            Optional<IssueDto> updatedIssue = issueService.updateIssue(issueId, updateDto);

            if (updatedIssue.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("issue", updatedIssue.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Issue not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PatchMapping("/{issueId}/status")
    public ResponseEntity<Map<String, Object>> updateIssueStatus(
            @PathVariable String issueId,
            @RequestParam String status,
            @RequestParam(required = false) String comments,
            @RequestParam(required = false) String afterPhotoUrl) {

        try {
            Optional<IssueDto> updatedIssue = issueService.updateIssueStatus(issueId, status, comments, afterPhotoUrl);

            if (updatedIssue.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("issue", updatedIssue.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Issue not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PatchMapping("/{issueId}/assign")
    public ResponseEntity<Map<String, Object>> assignIssueToDepartment(
            @PathVariable String issueId,
            @RequestParam String department) {

        try {
            Optional<IssueDto> updatedIssue = issueService.assignIssueToDepartment(issueId, department);

            if (updatedIssue.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("issue", updatedIssue.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Issue not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<Map<String, Object>> deleteIssue(@PathVariable String issueId) {
        try {
            issueService.deleteIssue(issueId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Issue deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Status counts
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("Reported", issueService.getIssueCountByStatus("Reported"));
        statusCounts.put("In Progress", issueService.getIssueCountByStatus("In Progress"));
        statusCounts.put("Resolved", issueService.getIssueCountByStatus("Resolved"));

        // Category counts
        Map<String, Long> categoryCounts = new HashMap<>();
        categoryCounts.put("Pothole", issueService.getIssueCountByCategory("Pothole"));
        categoryCounts.put("Graffiti", issueService.getIssueCountByCategory("Graffiti"));
        categoryCounts.put("Streetlight Outage", issueService.getIssueCountByCategory("Streetlight Outage"));
        categoryCounts.put("Waste Management", issueService.getIssueCountByCategory("Waste Management"));
        categoryCounts.put("Damaged Sign", issueService.getIssueCountByCategory("Damaged Sign"));
        categoryCounts.put("Water Leak", issueService.getIssueCountByCategory("Water Leak"));
        categoryCounts.put("Other", issueService.getIssueCountByCategory("Other"));

        stats.put("statusCounts", statusCounts);
        stats.put("categoryCounts", categoryCounts);

        return ResponseEntity.ok(stats);
    }
}
