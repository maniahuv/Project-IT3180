package controller;

import model.LichSuHoKhau;
import service.LichSuHoKhauService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lichsuhoKhau")
@CrossOrigin(origins = "*") // Cho phép React frontend truy cập API
public class LichSuHoKhauController {

    private final LichSuHoKhauService lichSuHoKhauService;

    public LichSuHoKhauController(LichSuHoKhauService lichSuHoKhauService) {
        this.lichSuHoKhauService = lichSuHoKhauService;
    }

    // Lấy toàn bộ lịch sử hộ khẩu
    @GetMapping
    public ResponseEntity<List<LichSuHoKhau>> getAll() {
        return ResponseEntity.ok(lichSuHoKhauService.getAll());
    }

    // Lấy một bản ghi lịch sử hộ khẩu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<LichSuHoKhau> getById(@PathVariable Integer id) {
        return lichSuHoKhauService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới lịch sử hộ khẩu
    @PostMapping
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<LichSuHoKhau> create(@RequestBody LichSuHoKhau lichSuHoKhau) {
        return ResponseEntity.ok(lichSuHoKhauService.create(lichSuHoKhau));
    }

    // Cập nhật lịch sử hộ khẩu
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody LichSuHoKhau lichSuHoKhau) {
        try {
            LichSuHoKhau updated = lichSuHoKhauService.update(id, lichSuHoKhau);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa lịch sử hộ khẩu
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            lichSuHoKhauService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
