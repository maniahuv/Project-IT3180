package service;

import model.TaiKhoan;
import repository.TaiKhoanRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Primary
public class TaiKhoanService implements UserDetailsService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<TaiKhoan> findAll() {
        return taiKhoanRepository.findAll();
    }

    public Optional<TaiKhoan> findById(Integer id) {
        return taiKhoanRepository.findById(id);
    }

    public TaiKhoan create(TaiKhoan taiKhoan) {
        if (taiKhoanRepository.findByUsername(taiKhoan.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        taiKhoan.setPassword(passwordEncoder.encode(taiKhoan.getPassword()));
        return taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan update(Integer id, TaiKhoan taiKhoan) {
        TaiKhoan existing = taiKhoanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        Optional<TaiKhoan> existingByUsername = taiKhoanRepository.findByUsername(taiKhoan.getUsername());
        if (existingByUsername.isPresent() && !existingByUsername.get().getId().equals(id)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        existing.setUsername(taiKhoan.getUsername());
        if (taiKhoan.getPassword() != null && !taiKhoan.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(taiKhoan.getPassword()));
        }
        existing.setHoTen(taiKhoan.getHoTen());
        existing.setVaiTro(taiKhoan.getVaiTro());
        return taiKhoanRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!taiKhoanRepository.existsById(id)) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }
        taiKhoanRepository.deleteById(id);
    }

    public TaiKhoan findByUsername(String username) {
        return taiKhoanRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        TaiKhoan taiKhoan = findByUsername(username);
        return User.builder()
                .username(taiKhoan.getUsername())
                .password(taiKhoan.getPassword())
                .roles(getRoleName(taiKhoan.getVaiTro()))
                .build();
    }

    private String getRoleName(Integer vaiTro) {
        switch (vaiTro) {
            case 1: return "TOTRUONG";
            case 2: return "TOPHO";
            case 3: return "KETOAN";
            default: return "USER";
        }
    }
}