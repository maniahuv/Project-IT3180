package service;

import model.NopPhi;
import model.TaiKhoan;
import repository.NopPhiRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NopPhiService {

    private final NopPhiRepository repo;

    public NopPhiService(NopPhiRepository repo) {
        this.repo = repo;
    }

    public List<NopPhi> findAll() {
        return repo.findAll();
    }

    public Optional<NopPhi> findById(Integer id) {
        return repo.findById(id);
    }

    public NopPhi save(NopPhi np, TaiKhoan keToan) {
        // Gán idNguoiThu là tài khoản kế toán đang thao tác
        np.setNguoiThu(keToan);
        return repo.save(np);
    }

    public void deleteById(Integer id) {
        repo.deleteById(id);
    }
}
