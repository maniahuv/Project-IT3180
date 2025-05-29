package service;

import java.util.List;

import model.NhanKhau;
import repository.NhanKhauDao;
import org.springframework.stereotype.Service;

@Service
public class NhanKhauService {

    private final NhanKhauDao nhanKhauDao = NhanKhauDao.getInstance();

    public List<NhanKhau> findAll() {
        return nhanKhauDao.findAll();
    }

    public NhanKhau findById(String id) {
        return nhanKhauDao.findById(id);
    }

    public int insert(NhanKhau nhanKhau) {
        return nhanKhauDao.insert(nhanKhau);
    }

    public int update(NhanKhau nhanKhau) {
        return nhanKhauDao.update(nhanKhau);
    }

    public int delete(String id) {
        return nhanKhauDao.delete(id);
    }
}
