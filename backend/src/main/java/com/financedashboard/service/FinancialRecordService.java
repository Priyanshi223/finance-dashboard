package com.financedashboard.service;

import com.financedashboard.domain.FinancialRecord;
import com.financedashboard.domain.RecordType;
import com.financedashboard.domain.User;
import com.financedashboard.dto.FinancialRecordRequest;
import com.financedashboard.dto.FinancialRecordResponse;
import com.financedashboard.dto.PageResponse;
import com.financedashboard.repository.FinancialRecordRepository;
import com.financedashboard.repository.FinancialRecordSpecifications;
import com.financedashboard.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
public class FinancialRecordService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository userRepository;

    public FinancialRecordService(FinancialRecordRepository recordRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<FinancialRecordResponse> list(
            LocalDate from,
            LocalDate to,
            String category,
            RecordType type,
            String search,
            int page,
            int size
    ) {
        int p = Math.max(0, page);
        int s = Math.min(100, Math.max(1, size));
        Specification<FinancialRecord> spec = Specification.where(FinancialRecordSpecifications.recordDateFrom(from))
                .and(FinancialRecordSpecifications.recordDateTo(to))
                .and(FinancialRecordSpecifications.categoryEquals(category))
                .and(FinancialRecordSpecifications.typeEquals(type))
                .and(FinancialRecordSpecifications.searchNotes(search));
        Page<FinancialRecord> result = recordRepository.findAll(
                spec,
                PageRequest.of(p, s, Sort.by(Sort.Order.desc("recordDate"), Sort.Order.desc("createdAt"))));
        return new PageResponse<>(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public FinancialRecordResponse getById(Long id) {
        return recordRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));
    }

    @Transactional
    public FinancialRecordResponse create(FinancialRecordRequest req, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        FinancialRecord r = new FinancialRecord();
        apply(r, req);
        r.setCreatedBy(creator);
        recordRepository.save(r);
        return toResponse(r);
    }

    @Transactional
    public FinancialRecordResponse update(Long id, FinancialRecordRequest req) {
        FinancialRecord r = recordRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));
        apply(r, req);
        return toResponse(r);
    }

    @Transactional
    public void delete(Long id) {
        if (!recordRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
        }
        recordRepository.deleteById(id);
    }

    private void apply(FinancialRecord r, FinancialRecordRequest req) {
        r.setAmount(req.amount());
        r.setType(req.type());
        r.setCategory(req.category().trim());
        r.setRecordDate(req.recordDate());
        r.setNotes(req.notes() != null ? req.notes().trim() : null);
    }

    private FinancialRecordResponse toResponse(FinancialRecord r) {
        String by = r.getCreatedBy() != null ? r.getCreatedBy().getUsername() : null;
        return new FinancialRecordResponse(
                r.getId(),
                r.getAmount(),
                r.getType(),
                r.getCategory(),
                r.getRecordDate(),
                r.getNotes(),
                r.getCreatedAt(),
                by);
    }
}
