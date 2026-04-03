package com.financedashboard.service;

import com.financedashboard.dto.LoginRequest;
import com.financedashboard.dto.LoginResponse;
import com.financedashboard.dto.UserResponse;
import com.financedashboard.repository.UserRepository;
import com.financedashboard.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid username or password");
        }
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        if (!user.isActive()) {
            throw new BadCredentialsException("Account is inactive");
        }
        String token = jwtService.generateToken(user.getUsername());
        return new LoginResponse(token, "Bearer", user.getUsername(), user.getRole(), user.isActive());
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        return new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.isActive());
    }
}
