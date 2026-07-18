package com.nihongo.backend.repository;

import com.nihongo.backend.entity.User;
import com.nihongo.backend.entity.VocabularyList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyListRepository extends JpaRepository<VocabularyList, Long> {
    List<VocabularyList> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndName(User user, String name);
}
