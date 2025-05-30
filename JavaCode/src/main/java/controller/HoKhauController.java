package controller;

import model.HoKhau;
import model.NhanKhau;
import service.HoKhauService;
import service.NhanKhauService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/hokhau")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class HoKhauController {

    private final HoKhauService hoKhauService;
    private final NhanKhauService nhanKhauService;

    public HoKhauController(HoKhauService hoKhauService, NhanKhauService nhanKhauService) {
        this.hoKhauService = hoKhauService;
        this.nhanKhauService = nhanKhauService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoKhau> getHoKhau(@PathVariable Integer id) {
        Optional<HoKhau> hoKhau = hoKhauService.findById(id);
        return hoKhau.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    @PostMapping
    public ResponseEntity<HoKhau> createHoKhau(@RequestBody HoKhau hoKhau,
                                               @RequestParam Integer maNhanKhauChuHo,
                                               @RequestParam int loaiThayDoi
                                               ) {

        Optional<NhanKhau> chuHo = nhanKhauService.getById(maNhanKhauChuHo);
        if (chuHo.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Gán chủ hộ
        hoKhau.setChuHo(maNhanKhauChuHo);
        HoKhau saved = hoKhauService.save(hoKhau, loaiThayDoi, chuHo.get());
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    @PutMapping("/{id}")
    public ResponseEntity<HoKhau> updateHoKhau(@PathVariable Integer id,
                                               @RequestBody HoKhau hoKhau,
                                               @RequestParam int loaiThayDoi
                                               ) {
        Optional<HoKhau> existing = hoKhauService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        HoKhau oldHoKhau = existing.get();
        oldHoKhau.setSoNha(hoKhau.getSoNha());
        oldHoKhau.setNgayCapNhat(hoKhau.getNgayCapNhat());
        oldHoKhau.setDienTich(hoKhau.getDienTich());
        oldHoKhau.setChuHo(hoKhau.getChuHo());
        // Cập nhật các trường khác nếu có

        // Lấy NhanKhau (chủ hộ) để ghi lịch sử (nếu cần)
        NhanKhau nhanKhau = null; // Bạn cần logic lấy NhanKhau theo chuHo hoặc truyền vào

        HoKhau saved = hoKhauService.save(oldHoKhau, loaiThayDoi, nhanKhau);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoKhau(@PathVariable Integer id) {
        hoKhauService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
