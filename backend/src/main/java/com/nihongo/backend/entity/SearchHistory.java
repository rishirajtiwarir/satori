package com.nihongo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String query;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    public SearchHistory() {}

    public SearchHistory(User user, String query, LocalDateTime searchedAt) {
        this.user = user;
        this.query = query;
        this.searchedAt = searchedAt;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public LocalDateTime getSearchedAt() { return searchedAt; }
    public void setSearchedAt(LocalDateTime searchedAt) { this.searchedAt = searchedAt; }
}
