package com.nihongo.backend.repository;

import com.nihongo.backend.entity.JlptPassage;
import com.nihongo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JlptPassageRepository extends JpaRepository<JlptPassage, Long> {
    List<JlptPassage> findByUserOrderByCreatedAtDesc(User user);
}
