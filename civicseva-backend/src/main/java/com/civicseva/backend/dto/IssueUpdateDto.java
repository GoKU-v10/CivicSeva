package com.civicseva.backend.dto;

import com.civicseva.backend.model.IssueStatus;
import java.time.LocalDateTime;

public class IssueUpdateDto {

    private LocalDateTime timestamp;
    private String status;
    private String description;

    // Constructors
    public IssueUpdateDto() {}

    public IssueUpdateDto(LocalDateTime timestamp, IssueStatus status, String description) {
        this.timestamp = timestamp;
        this.status = status.getDisplayName();
        this.description = description;
    }

    // Getters and Setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
