package service;

import model.LichSuHoKhau;
import repository.LichSuHoKhauRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LichSuHoKhauService {

    private final LichSuHoKhauRepository lichSuHoKhauRepository;

    public LichSuHoKhauService(LichSuHoKhauRepository lichSuHoKhauRepository) {
        this.lichSuHoKhauRepository = lichSuHoKhauRepository;
    }

    public List<LichSuHoKhau> getAll() {
        return lichSuHoKhauRepository.findAll();
    }

    public Optional<LichSuHoKhau> getById(Integer id) {
        return lichSuHoKhauRepository.findById(id);
    }

    public LichSuHoKhau create(LichSuHoKhau lichSuHoKhau) {
        return lichSuHoKhauRepository.save(lichSuHoKhau);
    }

    public LichSuHoKhau update(Integer id, LichSuHoKhau lichSuHoKhau) {
        return lichSuHoKhauRepository.findById(id).map(existing -> {
            existing.setLoaiThayDoi(lichSuHoKhau.getLoaiThayDoi());
            existing.setThoiGian(lichSuHoKhau.getThoiGian());
            // existing.setNoiDung(lichSuHoKhau.getNoiDung());
            existing.setHoKhau(lichSuHoKhau.getHoKhau());
            existing.setNhanKhau(lichSuHoKhau.getNhanKhau());
            return lichSuHoKhauRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử hộ khẩu id = " + id));
    }

    public void delete(Integer id) {
        lichSuHoKhauRepository.deleteById(id);
    }
}
