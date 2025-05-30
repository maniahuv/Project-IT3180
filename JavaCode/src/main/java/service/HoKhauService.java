package service;

import model.HoKhau;
import model.LichSuHoKhau;
import model.NhanKhau;
import repository.HoKhauRepository;
import repository.LichSuHoKhauRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class HoKhauService {

    private final HoKhauRepository hoKhauRepository;
    private final LichSuHoKhauRepository lichSuHoKhauRepository;

    public HoKhauService(HoKhauRepository hoKhauRepository, LichSuHoKhauRepository lichSuHoKhauRepository) {
        this.hoKhauRepository = hoKhauRepository;
        this.lichSuHoKhauRepository = lichSuHoKhauRepository;
    }

    public Optional<HoKhau> findById(Integer id) {
        return hoKhauRepository.findById(id);
    }

    public HoKhau save(HoKhau hoKhau, int loaiThayDoi, NhanKhau nhanKhau) {
        HoKhau savedHoKhau = hoKhauRepository.save(hoKhau);

        // Tạo lịch sử thay đổi
        LichSuHoKhau lichSu = new LichSuHoKhau();
        lichSu.setHoKhau(savedHoKhau);
        lichSu.setNhanKhau(nhanKhau);
        lichSu.setLoaiThayDoi(loaiThayDoi);
        lichSu.setThoiGian(LocalDateTime.now());
        // lichSu.setNoiDung(noiDung);

        lichSuHoKhauRepository.save(lichSu);

        return savedHoKhau;
    }

    @Transactional
    public void deleteById(Integer id) {
        hoKhauRepository.deleteById(id);
        // Có thể thêm logic xóa lịch sử liên quan nếu cần
    }
}
