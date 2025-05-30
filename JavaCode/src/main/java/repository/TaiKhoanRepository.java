package repository;

import model.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository  // không bắt buộc nhưng giúp rõ ràng
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    Optional<TaiKhoan> findByUsername(String username);
    boolean existsByUsername(String username);
}
