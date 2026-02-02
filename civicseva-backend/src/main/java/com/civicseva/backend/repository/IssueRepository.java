package com.civicseva.backend.repository;

import com.civicseva.backend.model.Issue;
import com.civicseva.backend.model.IssueCategory;
import com.civicseva.backend.model.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    Optional<Issue> findByIssueId(String issueId);

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByCategory(IssueCategory category);

    List<Issue> findByDepartment(String department);

    @Query("SELECT i FROM Issue i WHERE i.status = :status AND i.category = :category")
    List<Issue> findByStatusAndCategory(@Param("status") IssueStatus status,
                                       @Param("category") IssueCategory category);

    @Query("SELECT i FROM Issue i WHERE " +
           "(:latitude - i.latitude) * (:latitude - i.latitude) + " +
           "(:longitude - i.longitude) * (:longitude - i.longitude) < :radiusSquared")
    List<Issue> findIssuesNearLocation(@Param("latitude") Double latitude,
                                      @Param("longitude") Double longitude,
                                      @Param("radiusSquared") Double radiusSquared);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status")
    Long countByStatus(@Param("status") IssueStatus status);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.category = :category")
    Long countByCategory(@Param("category") IssueCategory category);

    @Query("SELECT i FROM Issue i ORDER BY i.reportedAt DESC")
    List<Issue> findAllOrderByReportedAtDesc();
}
