package service;

import java.sql.Date;
import java.util.List;

import model.KhoanThu;
import model.ThongKeKhoanThu;
import repository.KhoanThuDao;

public class KhoanThuSevice {

	private String taiKhoan;
	private KhoanThuDao khoanThuDao;

	public KhoanThuSevice(String taiKhoan) {
		this.taiKhoan = taiKhoan;
		this.khoanThuDao = KhoanThuDao.instance;
	}

	public boolean themMoi(KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null || duLieu.getMaDotThu() == null
				|| duLieu.getMaHoKhau() == null || duLieu.getMaLoaiKHoanThu() == null || duLieu.getNgayNop() == null) {
			return false;
		}
		if (khoanThuDao.insert(duLieu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Them khoan thu", "", "");
			return true;
		}
		return false;
	}

	public boolean xoa(String maKhoanThu) {
		if (maKhoanThu == null)
			return false;
		if (khoanThuDao.delete(maKhoanThu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa khoan thu", "", "");
			return true;
		}
		return false;
	}

	public boolean capNhat(KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaKhoanThu() == null) {
			return false;
		}

		String[] fields = { "MaDotThu", "MaHoKhau", "MaLoaiKHoanThu", "SoTienPhaiNop", "TrangThaiThanhToan",
				"NgayNop" };
		Object[] values = { duLieu.getMaDotThu(), duLieu.getMaHoKhau(), duLieu.getMaLoaiKHoanThu(),
				duLieu.getSoTienPhaiNop(), duLieu.getTrangThaiThanhToan(), duLieu.getNgayNop() };

		if (khoanThuDao.update(duLieu.getMaKhoanThu(), fields, values) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Them khoan thu", "", "");
			return true;
		}
		return false;
	}

	public KhoanThu layThongTin(String maDotThu) {
		return khoanThuDao.selectByID(maDotThu);
	}

	// tim dot thu theo tieu chi
	public List<KhoanThu> timTheoTieuChi(String maHoKhau, String maDotThu, Integer trangThai, Date tuNgay, Date denNgay,
			String orderBy, boolean asc, int limit, int offset) {
		return khoanThuDao.timTheoTieuChi(maHoKhau, maDotThu, trangThai, tuNgay, denNgay, orderBy, asc, limit, offset);
	}

	// Thong ke dot = tao bao cao
	public ThongKeKhoanThu thongKeKhoanThu() {
		return khoanThuDao.thongKe();
	}

}
