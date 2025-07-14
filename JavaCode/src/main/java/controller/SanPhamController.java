

package controller;

import model.SanPham;
import service.SanPhamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sanpham")
@CrossOrigin(origins = "http://localhost:3000") // Adjust to frontend URL
public class SanPhamController {
    private final SanPhamService service;
    private static final String REQUIRED_ROLE = "ROLE_KE_TOAN";

    public SanPhamController(SanPhamService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SanPham>> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/sanpham - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getById(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/sanpham/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/loinhuan")
    public ResponseEntity<BigDecimal> tinhLai(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/sanpham/" + id + "/loinhuan - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return ResponseEntity.ok(service.tinhLai(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<SanPham> create(@RequestBody SanPham sanPham) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("POST /api/sanpham - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.create(sanPham));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<SanPham> update(@PathVariable String id, @RequestBody SanPham sanPham) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("PUT /api/sanpham/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.update(id, sanPham));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DELETE /api/sanpham/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}