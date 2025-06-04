package repository;

import model.NhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanKhauRepository extends JpaRepository<NhanKhau, Integer> {
}
