// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
