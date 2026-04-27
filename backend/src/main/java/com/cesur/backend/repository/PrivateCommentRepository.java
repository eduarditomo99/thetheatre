package com.cesur.backend.repository;

import com.cesur.backend.model.PrivateComment;
import com.cesur.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivateCommentRepository extends JpaRepository<PrivateComment, Long> {

    List<PrivateComment> findByReviewOrderByCreatedAtAsc(Review review);
}
