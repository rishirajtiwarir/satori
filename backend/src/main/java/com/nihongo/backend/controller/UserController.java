package com.nihongo.backend.controller;

import com.nihongo.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/time-spent")
    public ResponseEntity<Void> updateTimeSpent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TimeSpentRequest request) {
        
        userService.updateTimeSpent(userDetails.getUsername(), request.getTimeSpent());
        return ResponseEntity.ok().build();
    }
    
    public static class TimeSpentRequest {
        private Long timeSpent;
        
        public Long getTimeSpent() { return timeSpent; }
        public void setTimeSpent(Long timeSpent) { this.timeSpent = timeSpent; }
    }
}
