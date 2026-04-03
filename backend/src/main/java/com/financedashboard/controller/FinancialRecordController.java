package com.financedashboard.controller;

import com.financedashboard.domain.RecordType;
import com.financedashboard.dto.FinancialRecordRequest;
import com.financedashboard.dto.FinancialRecordResponse;
import com.financedashboard.dto.PageResponse;
import com.financedashboard.service.FinancialRecordService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/records")
public class FinancialRecordController {

    private final FinancialRecordService recordService;

    public FinancialRecordController(FinancialRecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public PageResponse<FinancialRecordResponse> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) RecordType type,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return recordService.list(from, to, category, type, q, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public FinancialRecordResponse get(@PathVariable Long id) {
        return recordService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public FinancialRecordResponse create(
            @Valid @RequestBody FinancialRecordRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        return recordService.create(request, user.getUsername());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FinancialRecordResponse update(@PathVariable Long id, @Valid @RequestBody FinancialRecordRequest request) {
        return recordService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        recordService.delete(id);
    }
}
