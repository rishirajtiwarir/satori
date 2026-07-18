package com.nihongo.backend.dto;

public class AuthenticationResponse {
    private String token;
    private Long timeSpent;
    
    public AuthenticationResponse() {}
    
    public AuthenticationResponse(String token, Long timeSpent) {
        this.token = token;
        this.timeSpent = timeSpent;
    }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Long timeSpent) { this.timeSpent = timeSpent; }
}
