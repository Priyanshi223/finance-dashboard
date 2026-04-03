// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.controller;

import com.financedashboard.dto.LoginRequest;
import com.financedashboard.dto.LoginResponse;
import com.financedashboard.dto.UserResponse;
import com.financedashboard.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserDetails user) {
        return authService.currentUser(user.getUsername());
    }
}
