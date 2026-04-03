// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.RecordType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RecentActivityResponse(
        Long id,
        BigDecimal amount,
        RecordType type,
        String category,
        LocalDate recordDate,
        String notes
) {
}
