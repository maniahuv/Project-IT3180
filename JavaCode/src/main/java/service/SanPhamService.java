package service;

import model.SanPham;
import repository.SanPhamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {
    private final SanPhamRepository repository;

    public SanPhamService(SanPhamRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<SanPham> findAll() {
        List<SanPham> sanPhams = repository.findAll();
        System.out.println("Fetched SanPham count: " + sanPhams.size());
        return sanPhams;
    }

    @Transactional(readOnly = true)
    public Optional<SanPham> getById(String id) {
        return repository.findById(id);
    }

    @Transactional
    public SanPham create(SanPham sp) {
        validateSanPham(sp);
        if (sp.getIdSp() == null || sp.getIdSp().trim().isEmpty()) {
            String lastId = repository.findAll().stream()
                    .map(SanPham::getIdSp)
                    .filter(id -> id.startsWith("SP"))
                    .max(String::compareTo)
                    .orElse("SP000");
            int nextId = Integer.parseInt(lastId.replace("SP", "")) + 1;
            sp.setIdSp(String.format("SP%03d", nextId));
            throw new IllegalArgumentException("Vui lòng nhập mã sản phẩm (idSp).");
        }
        System.out.println("Creating SanPham: " + sp.getTen());
        return repository.save(sp);
    }

    @Transactional
    public SanPham update(String id, SanPham updated) {
        return repository.findById(id).map(existing -> {
            validateSanPham(updated);
            existing.setTen(updated.getTen());
            existing.setNgayNhapHang(updated.getNgayNhapHang());
            existing.setDonGiaGoc(updated.getDonGiaGoc());
            existing.setGiaBan(updated.getGiaBan());
            existing.setTonKho(updated.getTonKho());
            existing.setDaBan(updated.getDaBan());
            existing.setMoTa(updated.getMoTa());
            System.out.println("Updating SanPham ID: " + id);
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    @Transactional
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + id);
        }
        System.out.println("Deleting SanPham ID: " + id);
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public BigDecimal tinhLai(String id) {
        SanPham sanPham = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        BigDecimal loiNhuan = sanPham.getGiaBan()
                .subtract(sanPham.getDonGiaGoc())
                .multiply(BigDecimal.valueOf(sanPham.getDaBan()));
        System.out.println("Lợi nhuận của sản phẩm " + sanPham.getTen() + " (ID: " + id + "): " + loiNhuan);
        return loiNhuan;
    }

    private void validateSanPham(SanPham sp) {
        if (sp.getTen() == null || sp.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if (sp.getNgayNhapHang() == null) {
            throw new IllegalArgumentException("Ngày nhập hàng không được để trống");
        }
        if (sp.getDonGiaGoc() == null || sp.getDonGiaGoc().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Đơn giá gốc phải lớn hơn 0");
        }
        if (sp.getGiaBan() == null || sp.getGiaBan().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá bán phải lớn hơn 0");
        }
        if (sp.getTonKho() == null || sp.getTonKho() < 0) {
            throw new IllegalArgumentException("Tồn kho không được nhỏ hơn 0");
        }
        if (sp.getDaBan() == null || sp.getDaBan() < 0) {
            throw new IllegalArgumentException("Số lượng đã bán không được nhỏ hơn 0");
        }
    }
}