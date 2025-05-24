package service;
import java.sql.Date;
import java.util.List;
import model.DotThu;
import model.DotThu.TrangThaiDotThu;
import model.ThongKeDotThu;
import repository.DotThuDao;

public class DotThuService {
	private DotThuDao dotThuDao;
	public DotThuService() {
        this.dotThuDao = DotThuDao.instance;
    }
	public boolean themMoi (DotThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null || duLieu.getTenDotThu() == null || duLieu.getMoTa()==null || duLieu.getThoiGianBatDau()==null||duLieu.getThoiGianKetThuc()==null) {
            return false;
        }
		return dotThuDao.insert(duLieu) >0;
	}
	public boolean xoa (String maDotThu) {
		if (maDotThu == null ) return false;
		return dotThuDao.delete(maDotThu)>0;
	}
	public boolean capNhat (DotThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null) {
            return false;
        }

        String[] fields = {"TenDotThu", "ThoiGianBatDau", "ThoiGianKetThuc", "MoTa", "TrangThai"};
        Object[] values = {
                duLieu.getTenDotThu(),
                duLieu.getThoiGianBatDau(),
                duLieu.getThoiGianKetThuc(),
                duLieu.getMoTa(),
                duLieu.getTrangThai()
        };

        return dotThuDao.update(duLieu.getMaDotThu(), fields, values) > 0;
    }
	public DotThu layThongTin(String maDotThu) {
        return dotThuDao.selectByID(maDotThu);
    }
	//tim dot thu theo tieu chi
	public List <DotThu> timTheoTieuChi(String tenDotThu,
            String moTa,
            Date tuNgay,
            Date denNgay,
            String trangThai,
            String orderBy,
            boolean asc,
            int limit,
            int offset) {
		List <DotThu> result = dotThuDao.timDotThuTheoTieuChi(
	             tenDotThu,
	             moTa,
	             tuNgay,
	             denNgay,
	             trangThai,
	            orderBy,
	             asc, 
	            limit,
	             offset
	             );
		return  result;
		
		
	}
	//Thong ke dot = tao bao cao
	public ThongKeDotThu thongKeDotThu() {
        return dotThuDao.thongKeDotThu();
    }
	
	
}
