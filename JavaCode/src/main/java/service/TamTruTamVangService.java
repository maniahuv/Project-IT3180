package service;

import model.TamTruTamVang;
import repository.TamTruTamVangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TamTruTamVangService {

    @Autowired
    private TamTruTamVangRepository repository;

    public List<TamTruTamVang> findAll() {
        return repository.findAll();
    }

    public Optional<TamTruTamVang> findById(Integer id) {
        return repository.findById(id);
    }

    public TamTruTamVang save(TamTruTamVang tamTruTamVang) {
        return repository.save(tamTruTamVang);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
