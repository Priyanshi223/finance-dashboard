// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.Role;

public record LoginResponse(
        String token,
        String tokenType,
        String username,
        Role role,
        boolean active
) {
}
