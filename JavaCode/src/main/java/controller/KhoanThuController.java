package controller;

import model.KhoanThu;
import service.KhoanThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khoanthu")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class KhoanThuController {
    private final KhoanThuService service;

    public KhoanThuController(KhoanThuService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<KhoanThu>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhoanThu> getById(@PathVariable Integer id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThu> create(@RequestBody KhoanThu khoanThu) {
        return ResponseEntity.ok(service.create(khoanThu));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThu> update(@PathVariable Integer id, @RequestBody KhoanThu khoanThu) {
        return ResponseEntity.ok(service.update(id, khoanThu));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
