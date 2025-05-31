package service;

import model.NhanKhau;
import repository.NhanKhauRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NhanKhauService {

    private final NhanKhauRepository nhanKhauRepository;

    public NhanKhauService(NhanKhauRepository nhanKhauRepository) {
        this.nhanKhauRepository = nhanKhauRepository;
    }

    public List<NhanKhau> findAll() {
        return nhanKhauRepository.findAll();
    }

    public Optional<NhanKhau> getById(Integer id) {
        return nhanKhauRepository.findById(id);
    }

    public NhanKhau create(NhanKhau nhanKhau) {
        return nhanKhauRepository.save(nhanKhau);
    }

    public NhanKhau update(Integer id, NhanKhau nhanKhau) {
        return nhanKhauRepository.findById(id)
                .map(existing -> {
                    existing.setHoTen(nhanKhau.getHoTen());
                    existing.setNgaySinh(nhanKhau.getNgaySinh());
                    existing.setGioiTinh(nhanKhau.getGioiTinh());
                    existing.setCmnd(nhanKhau.getCmnd());
                    existing.setQhVoiChuHo(nhanKhau.getQhVoiChuHo());
                    existing.setTrangThai(nhanKhau.getTrangThai());
                    existing.setHoKhau(nhanKhau.getHoKhau());
                    return nhanKhauRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("NhanKhau not found with id " + id));
    }

    public void delete(Integer id) {
        nhanKhauRepository.deleteById(id);
    }
}