
package com.financedashboard.config;

import com.financedashboard.domain.FinancialRecord;
import com.financedashboard.domain.RecordType;
import com.financedashboard.domain.Role;
import com.financedashboard.domain.User;
import com.financedashboard.repository.FinancialRecordRepository;
import com.financedashboard.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final FinancialRecordRepository recordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            FinancialRecordRepository recordRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }
        User admin = persistUser("admin", "admin123", "admin@example.com", Role.ADMIN);
        persistUser("analyst", "analyst123", "analyst@example.com", Role.ANALYST);
        persistUser("viewer", "viewer123", "viewer@example.com", Role.VIEWER);

        LocalDate today = LocalDate.now();
        seedRecord(admin, new BigDecimal("8500.00"), RecordType.INCOME, "Salary", today.withDayOfMonth(1), "Monthly salary");
        seedRecord(admin, new BigDecimal("120.50"), RecordType.EXPENSE, "Food", today.minusDays(2), "Groceries");
        seedRecord(admin, new BigDecimal("45.00"), RecordType.EXPENSE, "Transport", today.minusDays(3), "Transit pass");
        seedRecord(admin, new BigDecimal("200.00"), RecordType.INCOME, "Freelance", today.minusDays(5), "Side project");
        seedRecord(admin, new BigDecimal("89.99"), RecordType.EXPENSE, "Utilities", today.minusDays(7), "Electric bill");
        seedRecord(admin, new BigDecimal("35.00"), RecordType.EXPENSE, "Food", today.minusDays(10), "Dining out");
        seedRecord(admin, new BigDecimal("15.00"), RecordType.EXPENSE, "Subscriptions", today.minusDays(12), "Streaming");
    }

    private User persistUser(String username, String rawPassword, String email, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        u.setEmail(email);
        u.setRole(role);
        u.setActive(true);
        return userRepository.save(u);
    }

    private void seedRecord(User creator, BigDecimal amount, RecordType type, String category, LocalDate date, String notes) {
        FinancialRecord r = new FinancialRecord();
        r.setAmount(amount);
        r.setType(type);
        r.setCategory(category);
        r.setRecordDate(date);
        r.setNotes(notes);
        r.setCreatedBy(creator);
        recordRepository.save(r);
    }
}
