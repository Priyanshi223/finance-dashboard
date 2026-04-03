// AI-Generated Code - 2026-04-02 - Claude
package com.financedashboard.security;

import com.financedashboard.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var u = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!u.isActive()) {
            throw new UsernameNotFoundException("User inactive");
        }
        var authority = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());
        return new User(u.getUsername(), u.getPasswordHash(), List.of(authority));
    }
}
