package controller;

import model.NhanKhau;
import model.TaiKhoan;
import service.HoKhauService;
import service.NhanKhauService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhankhau")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
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

    // @GetMapping
    // public ResponseEntity<List<NhanKhau>> getAll() {
    //     return ResponseEntity.ok(nhanKhauService.getAll());
    // }

    @GetMapping("/{id}")
    public ResponseEntity<NhanKhau> getById(@PathVariable Integer id) {
        return nhanKhauService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<NhanKhau> create(@RequestBody NhanKhau nhanKhau) {
        return ResponseEntity.ok(nhanKhauService.create(nhanKhau));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<NhanKhau> update(@PathVariable Integer id, @RequestBody NhanKhau nhanKhau) {
        return ResponseEntity.ok(nhanKhauService.update(id, nhanKhau));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nhanKhauService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
