package com.urlshortener.controller;

import com.urlshortener.dto.JwtResponse;
import com.urlshortener.dto.LoginRequest;
import com.urlshortener.dto.MessageResponse;
import com.urlshortener.dto.RegisterRequest;
import com.urlshortener.dto.ProfileUpdateRequest;
import com.urlshortener.entity.User;
import com.urlshortener.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);
        return ResponseEntity.ok(new MessageResponse("User registered successfully with ID: " + user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest profileUpdateRequest, Authentication authentication) {
        com.urlshortener.security.UserDetailsImpl userDetails = (com.urlshortener.security.UserDetailsImpl) authentication.getPrincipal();
        JwtResponse response = userService.updateUserProfile(
                userDetails.getId(),
                profileUpdateRequest.getUsername().trim(),
                profileUpdateRequest.getEmail().trim()
        );
        return ResponseEntity.ok(response);
    }
}

