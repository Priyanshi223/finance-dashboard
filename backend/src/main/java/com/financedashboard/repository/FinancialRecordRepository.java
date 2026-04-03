// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.repository;

import com.financedashboard.domain.FinancialRecord;
import com.financedashboard.domain.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long>,
        JpaSpecificationExecutor<FinancialRecord> {

    List<FinancialRecord> findByRecordDateBetweenOrderByRecordDateDescCreatedAtDesc(
            LocalDate from, LocalDate to);
}
