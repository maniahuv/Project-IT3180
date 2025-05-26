package service;

import java.sql.Date;
import java.util.List;

import model.DotThu;
import model.ThongKeDotThu;
import repository.DotThuDao;

public class DotThuService {

	private String taiKhoan;
	private DotThuDao dotThuDao;

	public DotThuService(String taiKhoan) {
		this.taiKhoan = taiKhoan;
		this.dotThuDao = DotThuDao.instance;
	}

	public boolean themMoi(DotThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null || duLieu.getTenDotThu() == null || duLieu.getMoTa() == null
				|| duLieu.getThoiGianBatDau() == null || duLieu.getThoiGianKetThuc() == null) {
			return false;
		}
		if (dotThuDao.insert(duLieu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Them dot thu", "", "");
			return true;
		}
		return false;
	}

	public boolean xoa(String maDotThu) {
		if (maDotThu == null)
			return false;
		if (dotThuDao.delete(maDotThu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa dot thu", "", "");
			return true;
		}
		return false;
	}

	public boolean capNhat(DotThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null) {
			return false;
		}

		String[] fields = { "TenDotThu", "ThoiGianBatDau", "ThoiGianKetThuc", "MoTa", "TrangThai" };
		Object[] values = { duLieu.getTenDotThu(), duLieu.getThoiGianBatDau(), duLieu.getThoiGianKetThuc(),
				duLieu.getMoTa(), duLieu.getTrangThai() };

		if (dotThuDao.update(duLieu.getMaDotThu(), fields, values) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Cap nhat dot thu", "", "");
			return true;
		}
		return false;
	}

	public DotThu layThongTin(String maDotThu) {
		return dotThuDao.selectByID(maDotThu);
	}

	// tim dot thu theo tieu chi
	public List<DotThu> timTheoTieuChi(String tenDotThu, String moTa, Date tuNgay, Date denNgay, String trangThai,
			String orderBy, boolean asc, int limit, int offset) {
		List<DotThu> result = dotThuDao.timDotThuTheoTieuChi(tenDotThu, moTa, tuNgay, denNgay, trangThai, orderBy, asc,
				limit, offset);
		return result;

	}

	// Thong ke dot = tao bao cao
	public ThongKeDotThu thongKeDotThu() {
		return dotThuDao.thongKeDotThu();
	}

}
