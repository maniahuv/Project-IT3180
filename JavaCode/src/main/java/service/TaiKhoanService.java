package service;

import model.TaiKhoan;
import model.TaiKhoan.VaiTro;
import repository.NhanKhauDao;
import repository.TaiKhoanDao;
import utils.Validator;

public class TaiKhoanService {

	public static boolean taoTaiKhoanMoi(TaiKhoan t) {
		if (kiemTraThongTin(t)) {
			if (TaiKhoanDao.instance.insert(t) > 0) {
				LichSuService.ghiNhanLichSu(t.getMaTaiKhoan(), "Tao tai khoan", "", "");
				return true;
			}
		}
		return false;
	}

	public static boolean kiemTraThongTin(TaiKhoan t) {
		return Validator.validEmail(t.getEmail()) && Validator.validLength(t.getMatKhau(), 100, false)
				&& Validator.validLength(t.getTenNguoiDung(), 100, true)
				&& Validator.validLength(t.getSoDienThoai(), 15, true) && VaiTro.toString(t.getVaiTro()).length() > 0
				&& NhanKhauDao.instance.selectByID(t.getMaNhanKhau()) != null;
	}

	public static boolean xoaTaiKhoan(String userId) {
		if (TaiKhoanDao.instance.delete(userId) == 0) {
			LichSuService.ghiNhanLichSu(userId, "Xoa tai khoan", "", "");
			return false;
		}
		return true;
	}

	public static boolean capNhatVaiTro(String userId, int vaiTro) {
		if (TaiKhoanDao.instance.update(userId, new String[] { "VaiTro" }, new Object[] { vaiTro }) > 0) {
			LichSuService.ghiNhanLichSu(userId, "Thay doi vai tro", "", "");
			return true;
		}
		return false;
	}

	public static boolean capNhatMatKhau(String userId, String moi) {
		if (TaiKhoanDao.instance.update(userId, new String[] { "MatKhau" }, new Object[] { moi }) > 0) {
			LichSuService.ghiNhanLichSu(userId, "Thay doi mat khau", "", "");
			return true;
		}
		return false;
	}

	public static TaiKhoan traCuuThongTin(String userId) {
		return TaiKhoanDao.instance.selectByID(userId);
	}

	public static boolean khoaMoTaiKhoan(String userId, boolean trangThai) {
		if (TaiKhoanDao.instance.update(userId, new String[] { "TrangThai" }, new Object[] { trangThai }) > 0) {
			LichSuService.ghiNhanLichSu(userId, trangThai ? "Mo tai khoan" : "Khoa tai khoan", "", "");
			return true;
		}
		return false;
	}

}
