package com.civicseva.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public class IssueDto {

    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private String imageHint;
    private LocationDto location;
    private String status;
    private String category;
    private String priority;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
    private String department;
    private Double confidence;
    private LocalDateTime eta;
    private List<IssueUpdateDto> updates;
    private List<IssueImageDto> images;

    // Constructors
    public IssueDto() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getImageHint() { return imageHint; }
    public void setImageHint(String imageHint) { this.imageHint = imageHint; }

    public LocationDto getLocation() { return location; }
    public void setLocation(LocationDto location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getEta() { return eta; }
    public void setEta(LocalDateTime eta) { this.eta = eta; }

    public List<IssueUpdateDto> getUpdates() { return updates; }
    public void setUpdates(List<IssueUpdateDto> updates) { this.updates = updates; }

    public List<IssueImageDto> getImages() { return images; }
    public void setImages(List<IssueImageDto> images) { this.images = images; }
}
