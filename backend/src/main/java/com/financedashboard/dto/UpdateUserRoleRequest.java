package com.financedashboard.dto;

import com.financedashboard.domain.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(@NotNull Role role) {
}
