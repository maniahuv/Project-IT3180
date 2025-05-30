package service;

import model.TaiKhoan;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final TaiKhoanService taiKhoanService;

    public UserDetailsServiceImpl(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        TaiKhoan taiKhoan = taiKhoanService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Map vaiTro to roles
        List<SimpleGrantedAuthority> authorities;
        switch (taiKhoan.getVaiTro()) {
            case 1:
                authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_TO_TRUONG"));
                break;
            case 0:
                authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            default:
                authorities = Collections.emptyList();
                break;
        }

        return User.withUsername(taiKhoan.getUsername())
                .password(taiKhoan.getPassword())
                .authorities(authorities)
                .build();
    }
}