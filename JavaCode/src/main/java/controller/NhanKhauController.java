package controller;

import model.NhanKhau;
import service.HoKhauService;
import service.NhanKhauService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhankhau")
@CrossOrigin(origins = "*")
public class NhanKhauController {

    private final NhanKhauService nhanKhauService;
    private final HoKhauService hoKhauService;

    public NhanKhauController(NhanKhauService nhanKhauService, HoKhauService hoKhauService) {
        this.nhanKhauService = nhanKhauService;
        this.hoKhauService = hoKhauService;
    }

    @GetMapping
    public List<NhanKhau> getAll() {
        return nhanKhauService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanKhau> getById(@PathVariable Integer id) {
        return nhanKhauService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<NhanKhau> create(@RequestBody NhanKhau nhanKhau) {
        if (nhanKhau.getMaHoKhau() != null) {
            return hoKhauService.findById(nhanKhau.getMaHoKhau())
                    .map(hoKhau -> {
                        nhanKhau.setHoKhau(hoKhau);
                        NhanKhau saved = nhanKhauService.create(nhanKhau);
                        return ResponseEntity.ok(saved);
                    })
                    .orElseGet(() -> ResponseEntity.badRequest().build());
        }
        NhanKhau saved = nhanKhauService.create(nhanKhau);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<NhanKhau> update(@PathVariable Integer id, @RequestBody NhanKhau nhanKhau) {
        if (nhanKhau.getMaHoKhau() != null) {
            return hoKhauService.findById(nhanKhau.getMaHoKhau())
                    .map(hoKhau -> {
                        nhanKhau.setHoKhau(hoKhau);
                        NhanKhau updated = nhanKhauService.update(id, nhanKhau);
                        return ResponseEntity.ok(updated);
                    })
                    .orElseGet(() -> ResponseEntity.badRequest().build());
        }
        NhanKhau updated = nhanKhauService.update(id, nhanKhau);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nhanKhauService.delete(id);
        return ResponseEntity.noContent().build();
    }
}