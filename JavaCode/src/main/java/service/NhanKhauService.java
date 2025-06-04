package service;

import model.HoKhau;
import model.LichSuHoKhau;
import model.NhanKhau;
import repository.NhanKhauRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import enums.LoaiThayDoi;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NhanKhauService {

    private final NhanKhauRepository nhanKhauRepository;
    private final LichSuHoKhauService lichSuHoKhauService;

    public NhanKhauService(NhanKhauRepository nhanKhauRepository, LichSuHoKhauService lichSuHoKhauService) {
        this.nhanKhauRepository = nhanKhauRepository;
        this.lichSuHoKhauService = lichSuHoKhauService;
    }

    public List<NhanKhau> findAll() {
        return nhanKhauRepository.findAll();
    }

    public Optional<NhanKhau> getById(Integer id) {
        return nhanKhauRepository.findById(id);
    }

   @Transactional
    public NhanKhau create(NhanKhau nhanKhau) {
        // Save the new NhanKhau
        NhanKhau savedNhanKhau = nhanKhauRepository.save(nhanKhau);

        // Create a LichSuHoKhau entry if hoKhau is provided
        if (nhanKhau.getHoKhau() != null && nhanKhau.getHoKhau().getMaHoKhau() != null) {
            LichSuHoKhau lichSuHoKhau = new LichSuHoKhau();
            lichSuHoKhau.setLoaiThayDoi(LoaiThayDoi.CREATE.getValue()); // Use enum for create operation
            lichSuHoKhau.setThoiGian(LocalDateTime.now());
            lichSuHoKhau.setHoKhau(nhanKhau.getHoKhau());
            lichSuHoKhau.setNhanKhau(savedNhanKhau);
            lichSuHoKhauService.create(lichSuHoKhau);
        }

        return savedNhanKhau;
    }

    @Transactional
    public NhanKhau update(Integer id, NhanKhau nhanKhau) {
        return nhanKhauRepository.findById(id)
                .map(existing -> {
                    // Store the original maHoKhau for comparison
                    Integer originalMaHoKhau = existing.getMaHoKhau();
                    HoKhau originalHoKhau = existing.getHoKhau();

                    // Update fields
                    existing.setHoTen(nhanKhau.getHoTen());
                    existing.setNgaySinh(nhanKhau.getNgaySinh());
                    existing.setGioiTinh(nhanKhau.getGioiTinh());
                    existing.setCmnd(nhanKhau.getCmnd());
                    existing.setQhVoiChuHo(nhanKhau.getQhVoiChuHo());
                    existing.setTrangThai(nhanKhau.getTrangThai());
                    existing.setHoKhau(nhanKhau.getHoKhau());

                    // Save updated NhanKhau
                    NhanKhau updatedNhanKhau = nhanKhauRepository.save(existing);

                    // Check if maHoKhau has changed
                    Integer newMaHoKhau = nhanKhau.getHoKhau() != null ? nhanKhau.getHoKhau().getMaHoKhau() : null;
                    if (originalMaHoKhau != null && newMaHoKhau != null && !originalMaHoKhau.equals(newMaHoKhau)) {
                        // Create a LichSuHoKhau entry if maHoKhau changed
                        LichSuHoKhau lichSuHoKhauUpdate = new LichSuHoKhau();
                        lichSuHoKhauUpdate.setLoaiThayDoi(LoaiThayDoi.UPDATE.getValue()); // Example: 2 for update operation
                        lichSuHoKhauUpdate.setThoiGian(LocalDateTime.now());
                        lichSuHoKhauUpdate.setHoKhau(nhanKhau.getHoKhau());
                        lichSuHoKhauUpdate.setNhanKhau(updatedNhanKhau);
                        lichSuHoKhauService.create(lichSuHoKhauUpdate);

                        LichSuHoKhau lichSuHoKhauUpdate2 = new LichSuHoKhau();
                        lichSuHoKhauUpdate2.setLoaiThayDoi(LoaiThayDoi.DELETE.getValue()); 
                        lichSuHoKhauUpdate2.setThoiGian(LocalDateTime.now());
                        lichSuHoKhauUpdate2.setHoKhau(originalHoKhau);
                        lichSuHoKhauUpdate2.setNhanKhau(updatedNhanKhau);
                        lichSuHoKhauService.create(lichSuHoKhauUpdate2);
                    }

                    return updatedNhanKhau;
                })
                .orElseThrow(() -> new RuntimeException("NhanKhau not found with id " + id));
    }

    public void delete(Integer id) {
        nhanKhauRepository.deleteById(id);
    }
}