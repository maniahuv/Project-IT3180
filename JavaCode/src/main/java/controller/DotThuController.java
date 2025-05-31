package controller;

import model.DotThu;
import service.DotThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dotthu")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class DotThuController {
    private final DotThuService service;

    public DotThuController(DotThuService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DotThu>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DotThu> getById(@PathVariable Integer id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<DotThu> create(@RequestBody DotThu dotThu) {
        return ResponseEntity.ok(service.create(dotThu));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<DotThu> update(@PathVariable Integer id, @RequestBody DotThu dotThu) {
        return ResponseEntity.ok(service.update(id, dotThu));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN') or hasRole('TO_TRUONG')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
