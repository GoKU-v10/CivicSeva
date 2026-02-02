package com.civicseva.backend.config;

import com.civicseva.backend.model.*;
import com.civicseva.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IssueRepository issueRepository;

    @Override
    public void run(String... args) throws Exception {
        if (issueRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create sample issue 1
        Issue issue1 = new Issue();
        issue1.setIssueId("IS-1");
        issue1.setTitle("Large pothole on main street");
        issue1.setDescription("A large and dangerous pothole has formed on the corner of Main St and 1st Ave, causing issues for traffic.");
        issue1.setImageUrl("https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg");
        issue1.setImageHint("pothole road");
        issue1.setLatitude(40.7128);
        issue1.setLongitude(-74.0060);
        issue1.setAddress("Main St & 1st Ave, New York, NY");
        issue1.setStatus(IssueStatus.IN_PROGRESS);
        issue1.setCategory(IssueCategory.POTHOLE);
        issue1.setPriority(IssuePriority.HIGH);
        issue1.setReportedAt(LocalDateTime.parse("2024-07-20T10:00:00"));
        issue1.setDepartment("Public Works");
        issue1.setConfidence(0.95);
        issue1.setEta(LocalDateTime.parse("2024-07-23T17:00:00"));

        // Add images for issue 1
        IssueImage beforeImage1 = new IssueImage("https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg", "Before", issue1);
        IssueImage progressImage1 = new IssueImage("https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg", "Work in progress", issue1);
        IssueImage afterImage1 = new IssueImage("https://i.pinimg.com/736x/03/90/18/0390186b460f48858349282218084a44.jpg", "After", issue1);
        issue1.addImage(beforeImage1);
        issue1.addImage(progressImage1);
        issue1.addImage(afterImage1);

        // Add updates for issue 1
        IssueUpdate update1_1 = new IssueUpdate(IssueStatus.REPORTED, "Issue submitted by citizen.", issue1);
        update1_1.setTimestamp(LocalDateTime.parse("2024-07-20T10:00:00"));
        IssueUpdate update1_2 = new IssueUpdate(IssueStatus.IN_PROGRESS, "Assigned to Public Works. A team has been dispatched.", issue1);
        update1_2.setTimestamp(LocalDateTime.parse("2024-07-20T11:30:00"));
        issue1.addUpdate(update1_1);
        issue1.addUpdate(update1_2);

        // Create sample issue 2
        Issue issue2 = new Issue();
        issue2.setIssueId("IS-4");
        issue2.setTitle("Overflowing trash can");
        issue2.setDescription("Public trash can on 5th Avenue is overflowing, leading to litter on the sidewalk.");
        issue2.setImageUrl("https://i.pinimg.com/1200x/07/4e/1a/074e1afeeae49ddb39969fbdba4bd8af.jpg");
        issue2.setImageHint("trash can");
        issue2.setLatitude(40.7739);
        issue2.setLongitude(-73.965);
        issue2.setAddress("5th Avenue, New York, NY");
        issue2.setStatus(IssueStatus.RESOLVED);
        issue2.setCategory(IssueCategory.WASTE_MANAGEMENT);
        issue2.setPriority(IssuePriority.LOW);
        issue2.setReportedAt(LocalDateTime.parse("2024-07-21T09:00:00"));
        issue2.setResolvedAt(LocalDateTime.parse("2024-07-21T15:00:00"));
        issue2.setDepartment("Sanitation");
        issue2.setConfidence(0.92);

        // Add images for issue 2
        IssueImage beforeImage2 = new IssueImage("https://i.pinimg.com/1200x/07/4e/1a/074e1afeeae49ddb39969fbdba4bd8af.jpg", "Before", issue2);
        IssueImage afterImage2 = new IssueImage("https://i.pinimg.com/1200x/74/99/92/749992e8739bc3eb1183990e14dbe05d.jpg", "After", issue2);
        issue2.addImage(beforeImage2);
        issue2.addImage(afterImage2);

        // Add updates for issue 2
        IssueUpdate update2_1 = new IssueUpdate(IssueStatus.REPORTED, "Issue submitted by citizen.", issue2);
        update2_1.setTimestamp(LocalDateTime.parse("2024-07-21T09:00:00"));
        IssueUpdate update2_2 = new IssueUpdate(IssueStatus.RESOLVED, "Trash has been collected.", issue2);
        update2_2.setTimestamp(LocalDateTime.parse("2024-07-21T15:00:00"));
        issue2.addUpdate(update2_1);
        issue2.addUpdate(update2_2);

        // Create sample issue 3
        Issue issue3 = new Issue();
        issue3.setIssueId("IS-5");
        issue3.setTitle("Damaged Stop Sign");
        issue3.setDescription("A stop sign at the corner of Liberty St and Nassau St is bent and difficult to see.");
        issue3.setImageUrl("https://i.pinimg.com/736x/29/70/4c/29704cd0075d0cc865bcda8f3dc3a075.jpg");
        issue3.setImageHint("street sign");
        issue3.setLatitude(40.7088);
        issue3.setLongitude(-74.009);
        issue3.setAddress("Liberty St & Nassau St, New York, NY");
        issue3.setStatus(IssueStatus.RESOLVED);
        issue3.setCategory(IssueCategory.DAMAGED_SIGN);
        issue3.setPriority(IssuePriority.HIGH);
        issue3.setReportedAt(LocalDateTime.parse("2024-07-18T08:45:00"));
        issue3.setResolvedAt(LocalDateTime.parse("2024-07-19T14:00:00"));
        issue3.setDepartment("Transportation");
        issue3.setConfidence(0.96);
        issue3.setEta(LocalDateTime.parse("2024-07-19T17:00:00"));

        // Add images for issue 3
        IssueImage beforeImage3 = new IssueImage("https://i.pinimg.com/736x/29/70/4c/29704cd0075d0cc865bcda8f3dc3a075.jpg", "Before", issue3);
        IssueImage afterImage3 = new IssueImage("https://i.pinimg.com/1200x/29/22/6a/29226adc9367dbb940c6b3d2296efd7f.jpg", "After", issue3);
        issue3.addImage(beforeImage3);
        issue3.addImage(afterImage3);

        // Add updates for issue 3
        IssueUpdate update3_1 = new IssueUpdate(IssueStatus.REPORTED, "Issue submitted by citizen.", issue3);
        update3_1.setTimestamp(LocalDateTime.parse("2024-07-18T08:45:00"));
        IssueUpdate update3_2 = new IssueUpdate(IssueStatus.IN_PROGRESS, "Repair crew has been dispatched for replacement.", issue3);
        update3_2.setTimestamp(LocalDateTime.parse("2024-07-18T10:00:00"));
        IssueUpdate update3_3 = new IssueUpdate(IssueStatus.RESOLVED, "Sign has been replaced.", issue3);
        update3_3.setTimestamp(LocalDateTime.parse("2024-07-19T14:00:00"));
        issue3.addUpdate(update3_1);
        issue3.addUpdate(update3_2);
        issue3.addUpdate(update3_3);

        // Save all issues
        issueRepository.save(issue1);
        issueRepository.save(issue2);
        issueRepository.save(issue3);

        System.out.println("Sample data initialized successfully!");
    }
}
