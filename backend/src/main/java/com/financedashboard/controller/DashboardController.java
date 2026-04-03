// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.controller;

import com.financedashboard.dto.CategoryTotalResponse;
import com.financedashboard.dto.DashboardSummaryResponse;
import com.financedashboard.dto.RecentActivityResponse;
import com.financedashboard.dto.TrendPointResponse;
import com.financedashboard.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.summary();
    }

    @GetMapping("/categories")
    public List<CategoryTotalResponse> categories() {
        return dashboardService.categoryTotals();
    }

    @GetMapping("/trends")
    public List<TrendPointResponse> trends(@RequestParam(defaultValue = "12") int months) {
        return dashboardService.monthlyTrends(months);
    }

    @GetMapping("/recent")
    public List<RecentActivityResponse> recent(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return dashboardService.recent(user, limit);
    }
}
