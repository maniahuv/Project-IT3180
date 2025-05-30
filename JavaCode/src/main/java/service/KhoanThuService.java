package service;

import model.KhoanThu;
import repository.KhoanThuRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KhoanThuService {
    private final KhoanThuRepository repository;

    public KhoanThuService(KhoanThuRepository repository) {
        this.repository = repository;
    }

    public List<KhoanThu> getAll() {
        return repository.findAll();
    }

    public Optional<KhoanThu> getById(Integer id) {
        return repository.findById(id);
    }

    public KhoanThu create(KhoanThu kt) {
        return repository.save(kt);
    }

    public KhoanThu update(Integer id, KhoanThu updated) {
        return repository.findById(id).map(existing -> {
            existing.setTenKhoanThu(updated.getTenKhoanThu());
            existing.setLoaiKhoanThu(updated.getLoaiKhoanThu());
            existing.setSoTien(updated.getSoTien());
            existing.setBatBuoc(updated.isBatBuoc());
            existing.setGhiChu(updated.getGhiChu());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy khoản thu"));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
