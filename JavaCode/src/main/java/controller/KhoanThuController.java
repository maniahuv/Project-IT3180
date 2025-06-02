package controller;

import model.KhoanThu;
import service.KhoanThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khoanthu")
@CrossOrigin(origins = "http://localhost:3000") // Adjust to frontend URL
public class KhoanThuController {
    private final KhoanThuService service;
    private static final String REQUIRED_ROLE = "ROLE_KE_TOAN";

    public KhoanThuController(KhoanThuService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<KhoanThu>> getAll() {
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // System.out.println("GET /api/khoanthu - User: " + auth.getName() +
        //         ", Roles: " + auth.getAuthorities());
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhoanThu> getById(@PathVariable Integer id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/khoanthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThu> create(@RequestBody KhoanThu khoanThu) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // System.out.println("POST /api/khoanthu - User: " + auth.getName() +
        //         ", Roles: " + auth.getAuthorities + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.create(khoanThu));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<KhoanThu> update(@PathVariable Integer id, @RequestBody KhoanThu khoanThu) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("PUT /api/khoanthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.update(id, khoanThu));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DELETE /api/khoanthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}