package service;

import java.sql.Date;
import java.util.List;

import model.KhoanThu;
import model.ThongKeKhoanThu;
import repository.KhoanThuDao;

public class KhoanThuService {

	public static boolean themMoi(String taiKhoan, KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null || duLieu.getMaDotThu() == null
				|| duLieu.getNgayNop() == null) {
			return false;
		}
		if (KhoanThuDao.instance.insert(duLieu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Them khoan thu", "", "");
			return true;
		}
		return false;
	}

	public static boolean xoa(String taiKhoan, String maKhoanThu) {
		if (maKhoanThu == null)
			return false;
		if (KhoanThuDao.instance.delete(maKhoanThu) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa khoan thu", "", "");
			return true;
		}
		return false;
	}

	public static boolean capNhat(String taiKhoan, KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaKhoanThu() == null) {
			return false;
		}

		String[] fields = { "MaDotThu", "SoTienPhaiNop", "NgayNop", "TenKhoanThu" };
		Object[] values = { duLieu.getMaDotThu(), (Double) duLieu.getSoTienPhaiNop(), duLieu.getNgayNop(),
				duLieu.getTenKhoanThu() };

		if (KhoanThuDao.instance.update(duLieu.getMaKhoanThu(), fields, values) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Them khoan thu", "", "");
			return true;
		}
		return false;
	}

	public static KhoanThu layThongTin(String maDotThu) {
		return KhoanThuDao.instance.selectByID(maDotThu);
	}

	// tim dot thu theo tieu chi
	public static List<KhoanThu> timTheoTieuChi(String maDotThu, Date tuNgay, Date denNgay, String orderBy, boolean asc,
			int limit, int offset) {
		return KhoanThuDao.instance.timTheoTieuChi(maDotThu, tuNgay, denNgay, orderBy, asc, limit, offset);
	}

	// Thong ke dot = tao bao cao
	@Deprecated
	public static ThongKeKhoanThu thongKeKhoanThu() {
		return KhoanThuDao.instance.thongKe();
	}

}
