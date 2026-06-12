package com.foodieai.backend.service;

import com.foodieai.backend.dto.RegisterRequest;
import com.foodieai.backend.model.User;
import com.foodieai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.foodieai.backend.dto.LoginRequest;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username already exists.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .password(request.getPassword())
                .build();

        userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        return user.getFullName();
    }
}