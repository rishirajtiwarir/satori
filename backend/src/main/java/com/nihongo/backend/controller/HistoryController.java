package com.nihongo.backend.controller;

import com.nihongo.backend.entity.SearchHistory;
import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.SearchHistoryRepository;
import com.nihongo.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
@CrossOrigin("*")
public class HistoryController {

    private final SearchHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public HistoryController(SearchHistoryRepository historyRepository, UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getHistory(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        List<SearchHistory> history = historyRepository.findByUserOrderBySearchedAtDesc(user);
        return ResponseEntity.ok(history);
    }
}
