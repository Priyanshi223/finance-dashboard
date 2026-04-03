package com.financedashboard.service;

import com.financedashboard.domain.FinancialRecord;
import com.financedashboard.domain.RecordType;
import com.financedashboard.domain.Role;
import com.financedashboard.dto.CategoryTotalResponse;
import com.financedashboard.dto.DashboardSummaryResponse;
import com.financedashboard.dto.RecentActivityResponse;
import com.financedashboard.dto.TrendPointResponse;
import com.financedashboard.repository.FinancialRecordRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final FinancialRecordRepository recordRepository;

    public DashboardService(FinancialRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary() {
        List<FinancialRecord> all = recordRepository.findAll();
        BigDecimal income = sum(all, RecordType.INCOME);
        BigDecimal expense = sum(all, RecordType.EXPENSE);
        long ic = all.stream().filter(r -> r.getType() == RecordType.INCOME).count();
        long ec = all.stream().filter(r -> r.getType() == RecordType.EXPENSE).count();
        return new DashboardSummaryResponse(income, expense, income.subtract(expense), ic, ec);
    }

    @Transactional(readOnly = true)
    public List<CategoryTotalResponse> categoryTotals() {
        List<FinancialRecord> all = recordRepository.findAll();
        var byCategory = all.stream().collect(Collectors.groupingBy(FinancialRecord::getCategory));
        List<CategoryTotalResponse> out = new ArrayList<>();
        for (var catEntry : byCategory.entrySet()) {
            String category = catEntry.getKey();
            Map<RecordType, List<FinancialRecord>> byType = catEntry.getValue().stream()
                    .collect(Collectors.groupingBy(FinancialRecord::getType));
            for (var typeEntry : byType.entrySet()) {
                List<FinancialRecord> list = typeEntry.getValue();
                BigDecimal total = list.stream().map(FinancialRecord::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                out.add(new CategoryTotalResponse(category, typeEntry.getKey(), total, list.size()));
            }
        }
        out.sort(Comparator.comparing(CategoryTotalResponse::category).thenComparing(c -> c.type().name()));
        return out;
    }

    @Transactional(readOnly = true)
    public List<TrendPointResponse> monthlyTrends(int months) {
        int m = Math.min(24, Math.max(1, months));
        YearMonth end = YearMonth.from(LocalDate.now());
        YearMonth start = end.minusMonths(m - 1L);
        List<FinancialRecord> all = recordRepository.findAll();
        List<TrendPointResponse> points = new ArrayList<>();
        for (YearMonth ym = start; !ym.isAfter(end); ym = ym.plusMonths(1)) {
            LocalDate from = ym.atDay(1);
            LocalDate to = ym.atEndOfMonth();
            BigDecimal income = BigDecimal.ZERO;
            BigDecimal expense = BigDecimal.ZERO;
            for (FinancialRecord r : all) {
                if (!r.getRecordDate().isBefore(from) && !r.getRecordDate().isAfter(to)) {
                    if (r.getType() == RecordType.INCOME) {
                        income = income.add(r.getAmount());
                    } else {
                        expense = expense.add(r.getAmount());
                    }
                }
            }
            points.add(new TrendPointResponse(ym.toString(), income, expense));
        }
        return points;
    }

    @Transactional(readOnly = true)
    public List<RecentActivityResponse> recent(UserDetails user, int limit) {
        int lim = Math.min(50, Math.max(1, limit));
        List<FinancialRecord> all = recordRepository.findAll().stream()
                .sorted(Comparator.comparing(FinancialRecord::getRecordDate).reversed()
                        .thenComparing(Comparator.comparing(FinancialRecord::getCreatedAt).reversed()))
                .limit(lim)
                .toList();
        Role role = resolveRole(user);
        return all.stream().map(r -> toRecent(r, role)).toList();
    }

    private RecentActivityResponse toRecent(FinancialRecord r, Role role) {
        String notes = (role == Role.VIEWER) ? null : r.getNotes();
        return new RecentActivityResponse(
                r.getId(), r.getAmount(), r.getType(), r.getCategory(), r.getRecordDate(), notes);
    }

    private Role resolveRole(UserDetails user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> Role.valueOf(a.substring(5)))
                .findFirst()
                .orElse(Role.VIEWER);
    }

    private static BigDecimal sum(List<FinancialRecord> all, RecordType type) {
        return all.stream()
                .filter(r -> r.getType() == type)
                .map(FinancialRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
