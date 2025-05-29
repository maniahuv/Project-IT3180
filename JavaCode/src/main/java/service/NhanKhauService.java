package service;

import model.NhanKhau;
import repository.NhanKhauDao;
import utils.Validator;

public class NhanKhauService {

	public static boolean taoNhanKhauMoi(String taiKhoan, NhanKhau t) {
		if (kiemTraThongTin(t)) {
			if (NhanKhauDao.instance.insert(t) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Them nhan khau", "", "");
				return true;
			}
		}
		return false;
	}

	public static boolean xoaNhanKhau(String taiKhoan, String id) {
		if (NhanKhauDao.instance.delete(id) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa nhan khau", "", "");
			return true;
		}
		return false;
	}

	public static boolean capNhatThongTin(String taiKhoan, NhanKhau t) {
		if (kiemTraThongTin(t)) {
			if (NhanKhauDao.instance.update(t.getMaNhanKhau(),
					new String[] { "NgheNghiep", "QuanHeVoiChuHo", "TinhTrangCuTru" }, new Object[] { t.getNgheNghiep(),
							(Integer) t.getQuanHeVoiChuHo(), (Integer) t.getTinhTrangCuTru() }) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Cap nhat thong tin nhan khau", "", "");
				return true;
			}
		}
		return false;
	}

	public static boolean kiemTraTonTai(String id) {
		if (NhanKhauDao.instance.selectByID(id) != null) {
			return true;
		}
		return false;
	}

	public static NhanKhau layThongTinNhanKhau(String id) {
		return NhanKhauDao.instance.selectByID(id);
	}

	public static boolean kiemTraThongTin(NhanKhau t) {
		return Validator.validLength(t.getHoTen(), 100, false) && Validator.validLength(t.getSoCCCD(), 100, false)
				&& Validator.isAllDigit(t.getSoCCCD()) && Validator.validLength(t.getNgheNghiep(), 100, true);
	}

	public static NhanKhau traCuuThongTin(String userId) {
		return NhanKhauDao.instance.selectByID(userId);
	}
	/*
	 * public ThongKeNhanKhau thongKeNhanKhau() { return
	 * NhanKhauDao.instance.thongKe(); }
	 */
}
