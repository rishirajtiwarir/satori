package com.nihongo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "generated_quizzes")
public class GeneratedQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GeneratedQuizQuestion> questions = new ArrayList<>();

    public GeneratedQuiz() {}

    public GeneratedQuiz(User user, String title, LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<GeneratedQuizQuestion> getQuestions() { return questions; }
    public void setQuestions(List<GeneratedQuizQuestion> questions) { this.questions = questions; }
    
    public void addQuestion(GeneratedQuizQuestion question) {
        questions.add(question);
        question.setQuiz(this);
    }
}
