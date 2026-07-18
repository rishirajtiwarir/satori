package com.nihongo.backend.controller;

import com.nihongo.backend.entity.JlptPassage;
import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.JlptPassageRepository;
import com.nihongo.backend.repository.UserRepository;
import com.nihongo.backend.service.AnalyzerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/passages")
@CrossOrigin("*")
public class PassageController {

    private final JlptPassageRepository passageRepository;
    private final UserRepository userRepository;
    private final AnalyzerService analyzerService;

    public PassageController(JlptPassageRepository passageRepository, UserRepository userRepository, AnalyzerService analyzerService) {
        this.passageRepository = passageRepository;
        this.userRepository = userRepository;
        this.analyzerService = analyzerService;
    }

    @GetMapping
    public ResponseEntity<?> getPassages(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        List<JlptPassage> passages = passageRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(passages);
    }

    @PostMapping
    public ResponseEntity<?> savePassage(Authentication authentication, @RequestBody Map<String, String> body) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        String title = body.get("title");
        String content = body.get("content");

        if (title == null || content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title and content cannot be empty");
        }

        JlptPassage passage = new JlptPassage(user, title, content, LocalDateTime.now());
        passageRepository.save(passage);
        return ResponseEntity.ok(passage);
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeText(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }

        List<AnalyzerService.ExtractedWord> extractedWords = analyzerService.analyzeText(content);
        return ResponseEntity.ok(extractedWords);
    }
}
