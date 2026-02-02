package com.civicseva.backend.repository;

import com.civicseva.backend.model.IssueUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueUpdateRepository extends JpaRepository<IssueUpdate, Long> {

    List<IssueUpdate> findByIssueIdOrderByTimestampDesc(Long issueId);
}
