package controller;

import model.NopPhi;
import model.TaiKhoan;
import service.NopPhiService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nopphi")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class NopPhiController {

    private final NopPhiService service;

    public NopPhiController(NopPhiService service) {
        this.service = service;
    }

    @GetMapping
    public List<NopPhi> getAll() {
        return service.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('KE_TOAN')")  // Chỉ kế toán được tạo sửa
    public NopPhi create(@RequestBody NopPhi nopPhi, @AuthenticationPrincipal TaiKhoan keToan) {
        return service.save(nopPhi, keToan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public NopPhi update(@PathVariable Integer id, @RequestBody NopPhi nopPhi, @AuthenticationPrincipal TaiKhoan keToan) {
        nopPhi.setId(id);
        return service.save(nopPhi, keToan);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('KE_TOAN')")
    public void delete(@PathVariable Integer id) {
        service.deleteById(id);
    }
}
