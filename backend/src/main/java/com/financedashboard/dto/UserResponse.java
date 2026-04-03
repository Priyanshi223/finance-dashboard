// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.Role;

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        boolean active
) {
}
