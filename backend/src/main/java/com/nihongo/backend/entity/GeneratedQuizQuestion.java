package com.nihongo.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "generated_quiz_questions")
public class GeneratedQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private GeneratedQuiz quiz;

    @Column(nullable = false)
    private String word;

    @Column(nullable = false)
    private String reading;

    @Column(nullable = false)
    private String meaning;

    @Column(name = "option_1", nullable = false)
    private String option1;

    @Column(name = "option_2", nullable = false)
    private String option2;

    @Column(name = "option_3", nullable = false)
    private String option3;

    @Column(name = "option_4", nullable = false)
    private String option4;

    @Column(name = "correct_option_index", nullable = false)
    private int correctOptionIndex;

    public GeneratedQuizQuestion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public GeneratedQuiz getQuiz() { return quiz; }
    public void setQuiz(GeneratedQuiz quiz) { this.quiz = quiz; }
    
    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }
    
    public String getReading() { return reading; }
    public void setReading(String reading) { this.reading = reading; }
    
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }

    public String getOption1() { return option1; }
    public void setOption1(String option1) { this.option1 = option1; }
    
    public String getOption2() { return option2; }
    public void setOption2(String option2) { this.option2 = option2; }
    
    public String getOption3() { return option3; }
    public void setOption3(String option3) { this.option3 = option3; }
    
    public String getOption4() { return option4; }
    public void setOption4(String option4) { this.option4 = option4; }

    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }
}
