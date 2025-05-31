package service;

import model.KhoanThu;
import model.DotThu;
import repository.KhoanThuRepository;
import repository.DotThuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhoanThuService {
    private final KhoanThuRepository repository;
    private final DotThuRepository dotThuRepository;

    public KhoanThuService(KhoanThuRepository repository, DotThuRepository dotThuRepository) {
        this.repository = repository;
        this.dotThuRepository = dotThuRepository;
    }

    @Transactional(readOnly = true)
    public List<KhoanThu> getAll() {
        List<KhoanThu> khoanThus = repository.findAll();
        System.out.println("Fetched KhoanThu count: " + khoanThus.size());
        khoanThus.forEach(kt -> System.out.println("KhoanThu: " + kt.getMaKhoanThu() + ", " + kt.getTenKhoanThu()));
        return khoanThus;
    }

    @Transactional(readOnly = true)
    public Optional<KhoanThu> getById(Integer id) {
        return repository.findById(id);
    }

    @Transactional
    public KhoanThu create(KhoanThu kt) {
        validateKhoanThu(kt);
        if (kt.getDotThu() != null && kt.getDotThu().getMaDotThu() != null) {
            DotThu dotThu = dotThuRepository.findById(kt.getDotThu().getMaDotThu())
                    .orElseThrow(() -> new IllegalArgumentException("Đợt thu không tồn tại với ID: " + kt.getDotThu().getMaDotThu()));
            kt.setDotThu(dotThu);
        }
        System.out.println("Creating KhoanThu: " + kt.getTenKhoanThu() + ", maDotThu: " +
                (kt.getDotThu() != null ? kt.getDotThu().getMaDotThu() : "null"));
        return repository.save(kt);
    }

    @Transactional
    public KhoanThu update(Integer id, KhoanThu updated) {
        return repository.findById(id).map(existing -> {
            validateKhoanThu(updated);
            if (updated.getDotThu() != null && updated.getDotThu().getMaDotThu() != null) {
                DotThu dotThu = dotThuRepository.findById(updated.getDotThu().getMaDotThu())
                        .orElseThrow(() -> new IllegalArgumentException("Đợt thu không tồn tại với ID: " + updated.getDotThu().getMaDotThu()));
                existing.setDotThu(dotThu);
            } else {
                existing.setDotThu(null);
            }
            existing.setTenKhoanThu(updated.getTenKhoanThu());
            existing.setLoaiKhoanThu(updated.getLoaiKhoanThu());
            existing.setSoTien(updated.getSoTien());
            existing.setBatBuoc(updated.isBatBuoc());
            existing.setGhiChu(updated.getGhiChu());
            System.out.println("Updating KhoanThu ID: " + id + ", maDotThu: " +
                    (updated.getDotThu() != null ? updated.getDotThu().getMaDotThu() : "null"));
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy khoản thu với ID: " + id));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy khoản thu với ID: " + id);
        }
        System.out.println("Deleting KhoanThu ID: " + id);
        repository.deleteById(id);
    }

    private void validateKhoanThu(KhoanThu kt) {
        if (kt.getTenKhoanThu() == null || kt.getTenKhoanThu().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên khoản thu không được để trống");
        }
        if (kt.getSoTien() != null && kt.getSoTien() < 0) {
            throw new IllegalArgumentException("Số tiền không được âm");
        }
    }
}