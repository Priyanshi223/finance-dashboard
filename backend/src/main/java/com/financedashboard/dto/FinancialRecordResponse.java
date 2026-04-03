// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.RecordType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record FinancialRecordResponse(
        Long id,
        BigDecimal amount,
        RecordType type,
        String category,
        LocalDate recordDate,
        String notes,
        Instant createdAt,
        String createdByUsername
) {
}
