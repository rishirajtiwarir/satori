package com.nihongo.backend.controller;

import com.nihongo.backend.entity.*;
import com.nihongo.backend.repository.SavedWordRepository;
import com.nihongo.backend.repository.UserRepository;
import com.nihongo.backend.repository.VocabularyListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vocabulary")
@CrossOrigin("*")
public class VocabularyController {

    private final VocabularyListRepository listRepository;
    private final SavedWordRepository wordRepository;
    private final UserRepository userRepository;

    public VocabularyController(VocabularyListRepository listRepository, SavedWordRepository wordRepository, UserRepository userRepository) {
        this.listRepository = listRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
    }

    // 1. Get all lists for a user
    @GetMapping("/lists")
    public ResponseEntity<?> getLists(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        List<VocabularyList> lists = new java.util.ArrayList<>(listRepository.findByUserOrderByCreatedAtDesc(user));
        
        // Auto-create default "Favorites" list if user has no lists
        if (lists.isEmpty()) {
            VocabularyList defaultList = new VocabularyList(user, "Favorites", LocalDateTime.now());
            listRepository.save(defaultList);
            lists.add(defaultList);
        }
        
        return ResponseEntity.ok(lists);
    }

    // 2. Create a new list
    @PostMapping("/lists")
    public ResponseEntity<?> createList(Authentication authentication, @RequestBody Map<String, String> body) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("List name cannot be empty");
        }

        if (listRepository.existsByUserAndName(user, name)) {
            return ResponseEntity.badRequest().body("A list with this name already exists");
        }

        VocabularyList newList = new VocabularyList(user, name, LocalDateTime.now());
        listRepository.save(newList);
        return ResponseEntity.ok(newList);
    }

    // 3. Save a word to a list
    @PostMapping("/words")
    public ResponseEntity<?> saveWord(Authentication authentication, @RequestBody Map<String, Object> body) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");

        try {
            Long listId = Long.parseLong(body.get("listId").toString());
            String japaneseWord = (String) body.get("japaneseWord");
            String reading = (String) body.get("reading");
            String englishMeaning = (String) body.get("englishMeaning");
            Priority priority = Priority.valueOf((String) body.get("priority"));

            VocabularyList list = listRepository.findById(listId).orElseThrow(() -> new RuntimeException("List not found"));

            SavedWord word = new SavedWord(list, japaneseWord, reading, englishMeaning, priority, LocalDateTime.now());
            wordRepository.save(word);

            return ResponseEntity.ok(word);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving word: " + e.getMessage());
        }
    }

    // 4. Get words in a list
    @GetMapping("/lists/{listId}/words")
    public ResponseEntity<?> getWordsInList(Authentication authentication, @PathVariable Long listId) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");

        VocabularyList list = listRepository.findById(listId).orElseThrow();
        List<SavedWord> words = wordRepository.findByVocabularyListOrderBySavedAtDesc(list);
        return ResponseEntity.ok(words);
    }
}
