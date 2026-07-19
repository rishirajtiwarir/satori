package com.nihongo.backend.repository;

import com.nihongo.backend.entity.GeneratedQuiz;
import com.nihongo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GeneratedQuizRepository extends JpaRepository<GeneratedQuiz, Long> {
    List<GeneratedQuiz> findByUserOrderByCreatedAtDesc(User user);
}
