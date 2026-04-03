// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.RecordType;

import java.math.BigDecimal;

public record CategoryTotalResponse(
        String category,
        RecordType type,
        BigDecimal total,
        long count
) {
}
