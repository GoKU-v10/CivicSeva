package com.civicseva.backend.repository;

import com.civicseva.backend.model.IssueImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueImageRepository extends JpaRepository<IssueImage, Long> {

    List<IssueImage> findByIssueIdOrderByCreatedAtAsc(Long issueId);
}
