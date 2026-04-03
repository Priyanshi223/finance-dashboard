// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.dto;

import com.financedashboard.domain.RecordType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FinancialRecordRequest(
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @NotNull RecordType type,
        @NotNull @Size(max = 80) String category,
        @NotNull LocalDate recordDate,
        @Size(max = 2000) String notes
) {
}
