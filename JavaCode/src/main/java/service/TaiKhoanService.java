package service;

import model.TaiKhoan;
import repository.TaiKhoanRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {

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

    public Optional<TaiKhoan> findByUsername(String username) {
        return taiKhoanRepository.findByUsername(username);
    }

    public TaiKhoan create(TaiKhoan taiKhoan) {
        if (taiKhoanRepository.existsByUsername(taiKhoan.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        taiKhoan.setPassword(passwordEncoder.encode(taiKhoan.getPassword()));
        return taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan update(Integer id, TaiKhoan updated) {
        return taiKhoanRepository.findById(id).map(tk -> {
            tk.setHoTen(updated.getHoTen());
            tk.setVaiTro(updated.getVaiTro());
            // Nếu muốn đổi password, xử lý riêng
            return taiKhoanRepository.save(tk);
        }).orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
    }

    public void delete(Integer id) {
        if (!taiKhoanRepository.existsById(id)) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }
        taiKhoanRepository.deleteById(id);
    }
}
