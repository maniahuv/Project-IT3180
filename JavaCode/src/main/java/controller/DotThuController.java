package controller;

import model.DotThu;
import service.DotThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dotthu")
@CrossOrigin(origins = "http://localhost:3000") // Adjust to frontend URL
public class DotThuController {
    private final DotThuService service;
    private static final String REQUIRED_ROLE = "ROLE_KE_TOAN";

    public DotThuController(DotThuService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DotThu>> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/dotthu - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DotThu> getById(@PathVariable Integer id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET /api/dotthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities());
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<DotThu> create(@RequestBody DotThu dotThu) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("POST /api/dotthu - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.create(dotThu));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<DotThu> update(@PathVariable Integer id, @RequestBody DotThu dotThu) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("PUT /api/dotthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        return ResponseEntity.ok(service.update(id, dotThu));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DELETE /api/dotthu/" + id + " - User: " + auth.getName() +
                ", Roles: " + auth.getAuthorities() + ", Required Role: " + REQUIRED_ROLE);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}