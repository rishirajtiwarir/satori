package com.nihongo.backend.controller;

import com.nihongo.backend.entity.SearchHistory;
import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.SearchHistoryRepository;
import com.nihongo.backend.repository.UserRepository;
import com.nihongo.backend.service.DictionaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dictionary")
@CrossOrigin("*")
public class DictionaryController {

    private final DictionaryService dictionaryService;
    private final SearchHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public DictionaryController(DictionaryService dictionaryService, SearchHistoryRepository historyRepository, UserRepository userRepository) {
        this.dictionaryService = dictionaryService;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<Object> search(@RequestParam String keyword, Authentication authentication) {
        try {
            // Log search history if user is authenticated
            if (authentication != null && authentication.getName() != null) {
                User user = userRepository.findByEmail(authentication.getName()).orElse(null);
                if (user != null) {
                    SearchHistory history = new SearchHistory(user, keyword, java.time.LocalDateTime.now());
                    historyRepository.save(history);
                }
            }

            Object result = dictionaryService.searchWord(keyword);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching dictionary data: " + e.getMessage());
        }
    }
}
