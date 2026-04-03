// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
) {
}
