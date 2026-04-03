package com.financedashboard.service;

import com.financedashboard.domain.User;
import com.financedashboard.dto.CreateUserRequest;
import com.financedashboard.dto.UpdateUserRoleRequest;
import com.financedashboard.dto.UpdateUserStatusRequest;
import com.financedashboard.dto.UserResponse;
import com.financedashboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public UserResponse create(CreateUserRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        User u = new User();
        u.setUsername(req.username().trim());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setEmail(req.email() != null ? req.email().trim() : null);
        u.setRole(req.role());
        u.setActive(true);
        userRepository.save(u);
        return toResponse(u);
    }

    @Transactional
    public UserResponse updateRole(Long id, UpdateUserRoleRequest req) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        u.setRole(req.role());
        return toResponse(u);
    }

    @Transactional
    public UserResponse updateStatus(Long id, UpdateUserStatusRequest req) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        u.setActive(req.active());
        return toResponse(u);
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole(), u.isActive());
    }
}
