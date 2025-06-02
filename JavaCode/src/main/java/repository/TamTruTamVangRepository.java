package repository;

import model.TamTruTamVang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TamTruTamVangRepository extends JpaRepository<TamTruTamVang, Integer> {
}
