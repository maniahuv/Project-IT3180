package controller;

import model.KhoanThuDotThu;
import service.KhoanThuDotThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khoanthu-dotthu")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class KhoanThuDotThuController {
    private final KhoanThuDotThuService service;

    public KhoanThuDotThuController(KhoanThuDotThuService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<KhoanThuDotThu>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhoanThuDotThu> getById(@PathVariable Integer id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThuDotThu> create(@RequestBody KhoanThuDotThu entity) {
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThuDotThu> update(@PathVariable Integer id, @RequestBody KhoanThuDotThu entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
