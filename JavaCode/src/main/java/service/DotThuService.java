package service;

import model.DotThu;
import repository.DotThuRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DotThuService {
    private final DotThuRepository repository;

    public DotThuService(DotThuRepository repository) {
        this.repository = repository;
    }

    public List<DotThu> getAll() {
        return repository.findAll();
    }

    public Optional<DotThu> getById(Integer id) {
        return repository.findById(id);
    }

    public DotThu create(DotThu dotThu) {
        return repository.save(dotThu);
    }

    public DotThu update(Integer id, DotThu updated) {
        return repository.findById(id).map(existing -> {
            existing.setTenDotThu(updated.getTenDotThu());
            existing.setNgayBatDau(updated.getNgayBatDau());
            existing.setNgayKetThuc(updated.getNgayKetThuc());
            existing.setTrangThai(updated.getTrangThai());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đợt thu"));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
