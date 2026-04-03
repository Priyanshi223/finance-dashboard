// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.repository;

import com.financedashboard.domain.FinancialRecord;
import com.financedashboard.domain.RecordType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class FinancialRecordSpecifications {

    private FinancialRecordSpecifications() {
    }

    public static Specification<FinancialRecord> recordDateFrom(LocalDate from) {
        return (root, q, cb) -> from == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("recordDate"), from);
    }

    public static Specification<FinancialRecord> recordDateTo(LocalDate to) {
        return (root, q, cb) -> to == null ? cb.conjunction() : cb.lessThanOrEqualTo(root.get("recordDate"), to);
    }

    public static Specification<FinancialRecord> categoryEquals(String category) {
        return (root, q, cb) ->
                category == null || category.isBlank()
                        ? cb.conjunction()
                        : cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase());
    }

    public static Specification<FinancialRecord> typeEquals(RecordType type) {
        return (root, q, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    public static Specification<FinancialRecord> searchNotes(String q) {
        return (root, query, cb) ->
                q == null || q.isBlank()
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("notes")), "%" + q.trim().toLowerCase() + "%");
    }
}
