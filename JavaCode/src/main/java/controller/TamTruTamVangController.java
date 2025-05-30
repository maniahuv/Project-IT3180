package controller;

import model.TamTruTamVang;
import service.TamTruTamVangService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tamtrutamvang")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class TamTruTamVangController {

    private final TamTruTamVangService service;

    public TamTruTamVangController(TamTruTamVangService service) {
        this.service = service;
    }

    @GetMapping
    public List<TamTruTamVang> getAll() {
        return service.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")  // Chỉ tổ trưởng/tổ phó được tạo sửa
    public TamTruTamVang create(@RequestBody TamTruTamVang tamTru) {
        return service.save(tamTru);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public TamTruTamVang update(@PathVariable Integer id, @RequestBody TamTruTamVang tamTru) {
        tamTru.setId(id);
        return service.save(tamTru);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TO_TRUONG', 'TO_PHO')")
    public void delete(@PathVariable Integer id) {
        service.deleteById(id);
    }
}
