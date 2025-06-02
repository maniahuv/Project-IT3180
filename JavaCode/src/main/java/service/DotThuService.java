package service;

import model.DotThu;
import repository.DotThuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DotThuService {
    private final DotThuRepository repository;

    public DotThuService(DotThuRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<DotThu> findAll() {
        List<DotThu> dotThus = repository.findAll();
        System.out.println("Fetched DotThu count: " + dotThus.size());
        return dotThus;
    }

    @Transactional(readOnly = true)
    public Optional<DotThu> getById(Integer id) {
        return repository.findById(id);
    }

    @Transactional
    public DotThu create(DotThu dt) {
        validateDotThu(dt);
        System.out.println("Creating DotThu: " + dt.getTenDotThu());
        return repository.save(dt);
    }

    @Transactional
    public DotThu update(Integer id, DotThu updated) {
        return repository.findById(id).map(existing -> {
            validateDotThu(updated);
            existing.setTenDotThu(updated.getTenDotThu());
            existing.setNgayBatDau(updated.getNgayBatDau());
            existing.setNgayKetThuc(updated.getNgayKetThuc());
            existing.setTrangThai(updated.getTrangThai());
            System.out.println("Updating DotThu ID: " + id);
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đợt thu với ID: " + id));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy đợt thu với ID: " + id);
        }
        System.out.println("Deleting DotThu ID: " + id);
        repository.deleteById(id);
    }

    private void validateDotThu(DotThu dt) {
        if (dt.getTenDotThu() == null || dt.getTenDotThu().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên đợt thu không được để trống");
        }
        if (dt.getNgayBatDau() != null && dt.getNgayKetThuc() != null &&
                dt.getNgayBatDau().isAfter(dt.getNgayKetThuc())) {
            throw new IllegalArgumentException("Ngày bắt đầu không được sau ngày kết thúc");
        }
        if (dt.getTrangThai() != null) {
            try {
                DotThu.TrangThai.valueOf(dt.getTrangThai().replace(" ", "_").toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ: " + dt.getTrangThai());
            }
        }
    }
}