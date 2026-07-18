package com.nihongo.backend.service;

import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void updateTimeSpent(String email, Long timeSpent) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setTimeSpent(timeSpent);
        userRepository.save(user);
    }
}
