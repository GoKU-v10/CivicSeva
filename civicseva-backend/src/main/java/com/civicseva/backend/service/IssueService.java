package com.civicseva.backend.service;

import com.civicseva.backend.dto.*;
import com.civicseva.backend.model.*;
import com.civicseva.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public List<IssueDto> getAllIssues() {
        return issueRepository.findAllOrderByReportedAtDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<IssueDto> getIssueById(String issueId) {
        return issueRepository.findByIssueId(issueId)
                .map(this::convertToDto);
    }

    public List<IssueDto> getIssuesByStatus(String status) {
        IssueStatus issueStatus = IssueStatus.fromDisplayName(status);
        return issueRepository.findByStatus(issueStatus)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> getIssuesByCategory(String category) {
        IssueCategory issueCategory = IssueCategory.fromDisplayName(category);
        return issueRepository.findByCategory(issueCategory)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> getIssuesByDepartment(String department) {
        return issueRepository.findByDepartment(department)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> getIssuesNearLocation(Double latitude, Double longitude, Double radiusKm) {
        // Convert radius from km to degrees (rough approximation)
        Double radiusSquared = Math.pow(radiusKm / 111.0, 2);
        return issueRepository.findIssuesNearLocation(latitude, longitude, radiusSquared)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public IssueDto createIssue(CreateIssueDto createIssueDto) {
        Issue issue = new Issue();
        issue.setTitle(createIssueDto.getTitle());
        issue.setDescription(createIssueDto.getDescription());
        issue.setImageUrl(createIssueDto.getImageUrl());
        issue.setImageHint(createIssueDto.getImageHint());
        issue.setLatitude(createIssueDto.getLatitude());
        issue.setLongitude(createIssueDto.getLongitude());
        issue.setAddress(createIssueDto.getAddress());
        issue.setCategory(IssueCategory.fromDisplayName(createIssueDto.getCategory()));
        issue.setStatus(IssueStatus.REPORTED);

        if (createIssueDto.getPriority() != null) {
            issue.setPriority(IssuePriority.fromDisplayName(createIssueDto.getPriority()));
        } else {
            issue.setPriority(IssuePriority.MEDIUM);
        }

        if (createIssueDto.getDepartment() != null) {
            issue.setDepartment(createIssueDto.getDepartment());
        } else {
            issue.setDepartment("Pending Assignment");
        }

        // Add initial update
        IssueUpdate initialUpdate = new IssueUpdate(
            IssueStatus.REPORTED,
            "Issue submitted by citizen.",
            issue
        );
        issue.addUpdate(initialUpdate);

        // Add initial image if provided
        if (createIssueDto.getImageUrl() != null) {
            IssueImage initialImage = new IssueImage(
                createIssueDto.getImageUrl(),
                "Before",
                issue
            );
            issue.addImage(initialImage);
        }

        Issue savedIssue = issueRepository.save(issue);
        return convertToDto(savedIssue);
    }

    public Optional<IssueDto> updateIssue(String issueId, CreateIssueDto updateDto) {
        Optional<Issue> issueOpt = issueRepository.findByIssueId(issueId);

        if (issueOpt.isPresent()) {
            Issue issue = issueOpt.get();

            // Only allow updates for issues with REPORTED status
            if (issue.getStatus() != IssueStatus.REPORTED) {
                throw new IllegalStateException("Can only edit issues with 'Reported' status.");
            }

            issue.setTitle(updateDto.getTitle());
            issue.setDescription(updateDto.getDescription());

            if (updateDto.getImageUrl() != null) {
                issue.setImageUrl(updateDto.getImageUrl());

                // Update the "Before" image
                List<IssueImage> images = issue.getImages();
                boolean beforeImageExists = false;
                for (IssueImage img : images) {
                    if ("Before".equalsIgnoreCase(img.getCaption())) {
                        img.setUrl(updateDto.getImageUrl());
                        beforeImageExists = true;
                        break;
                    }
                }

                if (!beforeImageExists) {
                    IssueImage beforeImage = new IssueImage(updateDto.getImageUrl(), "Before", issue);
                    issue.addImage(beforeImage);
                }
            }

            // Add update entry
            IssueUpdate update = new IssueUpdate(
                IssueStatus.REPORTED,
                "Issue details updated by citizen.",
                issue
            );
            issue.addUpdate(update);

            Issue savedIssue = issueRepository.save(issue);
            return Optional.of(convertToDto(savedIssue));
        }

        return Optional.empty();
    }

    public Optional<IssueDto> updateIssueStatus(String issueId, String status, String comments, String afterPhotoUrl) {
        Optional<Issue> issueOpt = issueRepository.findByIssueId(issueId);

        if (issueOpt.isPresent()) {
            Issue issue = issueOpt.get();
            IssueStatus newStatus = IssueStatus.fromDisplayName(status);

            issue.setStatus(newStatus);

            if (newStatus == IssueStatus.RESOLVED) {
                issue.setResolvedAt(LocalDateTime.now());
            }

            // Add after photo if provided
            if (afterPhotoUrl != null && !afterPhotoUrl.isEmpty()) {
                IssueImage afterImage = new IssueImage(afterPhotoUrl, "After", issue);
                issue.addImage(afterImage);
            }

            // Add status update
            String description = comments != null ? comments : "Status updated to " + status;
            IssueUpdate update = new IssueUpdate(newStatus, description, issue);
            issue.addUpdate(update);

            Issue savedIssue = issueRepository.save(issue);
            return Optional.of(convertToDto(savedIssue));
        }

        return Optional.empty();
    }

    public Optional<IssueDto> assignIssueToDepartment(String issueId, String department) {
        Optional<Issue> issueOpt = issueRepository.findByIssueId(issueId);

        if (issueOpt.isPresent()) {
            Issue issue = issueOpt.get();
            issue.setDepartment(department);

            if (issue.getStatus() == IssueStatus.REPORTED) {
                issue.setStatus(IssueStatus.IN_PROGRESS);
            }

            IssueUpdate update = new IssueUpdate(
                issue.getStatus(),
                "Issue assigned to " + department + " department.",
                issue
            );
            issue.addUpdate(update);

            Issue savedIssue = issueRepository.save(issue);
            return Optional.of(convertToDto(savedIssue));
        }

        return Optional.empty();
    }

    public void deleteIssue(String issueId) {
        issueRepository.findByIssueId(issueId).ifPresent(issueRepository::delete);
    }

    // Statistics methods
    public Long getIssueCountByStatus(String status) {
        IssueStatus issueStatus = IssueStatus.fromDisplayName(status);
        return issueRepository.countByStatus(issueStatus);
    }

    public Long getIssueCountByCategory(String category) {
        IssueCategory issueCategory = IssueCategory.fromDisplayName(category);
        return issueRepository.countByCategory(issueCategory);
    }

    private IssueDto convertToDto(Issue issue) {
        IssueDto dto = new IssueDto();
        dto.setId(issue.getIssueId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setImageUrl(issue.getImageUrl());
        dto.setImageHint(issue.getImageHint());

        LocationDto location = new LocationDto(
            issue.getLatitude(),
            issue.getLongitude(),
            issue.getAddress()
        );
        dto.setLocation(location);

        dto.setStatus(issue.getStatus().getDisplayName());
        dto.setCategory(issue.getCategory().getDisplayName());
        dto.setPriority(issue.getPriority() != null ? issue.getPriority().getDisplayName() : null);
        dto.setReportedAt(issue.getReportedAt());
        dto.setResolvedAt(issue.getResolvedAt());
        dto.setDepartment(issue.getDepartment());
        dto.setConfidence(issue.getConfidence());
        dto.setEta(issue.getEta());

        List<IssueUpdateDto> updates = issue.getUpdates().stream()
                .map(update -> new IssueUpdateDto(update.getTimestamp(), update.getStatus(), update.getDescription()))
                .collect(Collectors.toList());
        dto.setUpdates(updates);

        List<IssueImageDto> images = issue.getImages().stream()
                .map(image -> new IssueImageDto(image.getUrl(), image.getCaption()))
                .collect(Collectors.toList());
        dto.setImages(images);

        return dto;
    }
}
