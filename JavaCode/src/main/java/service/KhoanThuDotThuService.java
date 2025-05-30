package service;

import model.KhoanThuDotThu;
import repository.KhoanThuDotThuRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KhoanThuDotThuService {
    private final KhoanThuDotThuRepository repository;

    public KhoanThuDotThuService(KhoanThuDotThuRepository repository) {
        this.repository = repository;
    }

    public List<KhoanThuDotThu> getAll() {
        return repository.findAll();
    }

    public Optional<KhoanThuDotThu> getById(Integer id) {
        return repository.findById(id);
    }

    public KhoanThuDotThu create(KhoanThuDotThu entity) {
        return repository.save(entity);
    }

    public KhoanThuDotThu update(Integer id, KhoanThuDotThu updated) {
        return repository.findById(id).map(existing -> {
            existing.setKhoanThu(updated.getKhoanThu());
            existing.setDotThu(updated.getDotThu());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy liên kết Khoản Thu - Đợt Thu"));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
