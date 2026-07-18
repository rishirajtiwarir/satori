package com.nihongo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_words")
public class SavedWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private VocabularyList vocabularyList;

    @Column(nullable = false)
    private String japaneseWord;

    private String reading;

    @Column(columnDefinition = "TEXT")
    private String englishMeaning;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    public SavedWord() {}

    public SavedWord(VocabularyList vocabularyList, String japaneseWord, String reading, String englishMeaning, Priority priority, LocalDateTime savedAt) {
        this.vocabularyList = vocabularyList;
        this.japaneseWord = japaneseWord;
        this.reading = reading;
        this.englishMeaning = englishMeaning;
        this.priority = priority;
        this.savedAt = savedAt;
    }

    public Long getId() { return id; }
    @com.fasterxml.jackson.annotation.JsonIgnore
    public VocabularyList getVocabularyList() { return vocabularyList; }
    public void setVocabularyList(VocabularyList vocabularyList) { this.vocabularyList = vocabularyList; }
    public String getJapaneseWord() { return japaneseWord; }
    public void setJapaneseWord(String japaneseWord) { this.japaneseWord = japaneseWord; }
    public String getReading() { return reading; }
    public void setReading(String reading) { this.reading = reading; }
    public String getEnglishMeaning() { return englishMeaning; }
    public void setEnglishMeaning(String englishMeaning) { this.englishMeaning = englishMeaning; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }
}
