package com.nihongo.backend.controller;

import com.nihongo.backend.entity.GeneratedQuiz;
import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.GeneratedQuizRepository;
import com.nihongo.backend.repository.UserRepository;
import com.nihongo.backend.service.PdfQuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quiz")
@CrossOrigin("*")
public class QuizController {

    private final PdfQuizService pdfQuizService;
    private final UserRepository userRepository;
    private final GeneratedQuizRepository generatedQuizRepository;

    public QuizController(PdfQuizService pdfQuizService, UserRepository userRepository, GeneratedQuizRepository generatedQuizRepository) {
        this.pdfQuizService = pdfQuizService;
        this.userRepository = userRepository;
        this.generatedQuizRepository = generatedQuizRepository;
    }

    @PostMapping("/generate-from-pdf")
    public ResponseEntity<?> generateFromPdf(@RequestParam("file") MultipartFile file, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            GeneratedQuiz quiz = pdfQuizService.generateQuizFromPdf(file, user);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating quiz: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getQuizHistory(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        List<GeneratedQuiz> quizzes = generatedQuizRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");
        
        return generatedQuizRepository.findById(id)
            .filter(q -> q.getUser().getId().equals(user.getId()))
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
