package com.nihongo.backend.repository;

import com.nihongo.backend.entity.SearchHistory;
import com.nihongo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderBySearchedAtDesc(User user);
    void deleteByUser(User user);
}
