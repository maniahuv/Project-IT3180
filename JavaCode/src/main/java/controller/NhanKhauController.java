package controller;

import java.util.List;

import model.NhanKhau;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.NhanKhauService;

@RestController
@RequestMapping("/api/nhankhau")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class NhanKhauController {

    @Autowired
    private NhanKhauService nhanKhauService;

    @GetMapping
    public List<NhanKhau> getAll() {
        return nhanKhauService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanKhau> getById(@PathVariable String id) {
        NhanKhau nhanKhau = nhanKhauService.findById(id);
        if (nhanKhau == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nhanKhau);
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody NhanKhau nhanKhau) {
        int result = nhanKhauService.insert(nhanKhau);
        if (result > 0) {
            return ResponseEntity.ok("Thêm thành công");
        }
        return ResponseEntity.status(500).body("Thêm thất bại");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody NhanKhau nhanKhau) {
        nhanKhau.setMaNhanKhau(id);
        int result = nhanKhauService.update(nhanKhau);
        if (result > 0) {
            return ResponseEntity.ok("Cập nhật thành công");
        }
        return ResponseEntity.status(500).body("Cập nhật thất bại");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        int result = nhanKhauService.delete(id);
        if (result > 0) {
            return ResponseEntity.ok("Xóa thành công");
        }
        return ResponseEntity.status(500).body("Xóa thất bại");
    }
}
