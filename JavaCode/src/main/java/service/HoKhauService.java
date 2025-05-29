package service;

import model.HoKhau;
import model.ThongKeHoKhau;
import repository.HoKhauDao;
import repository.NhanKhauDao;
import utils.Validator;

public class HoKhauService {

	public static boolean taoHoKhauMoi(String taiKhoan, HoKhau t) {
		if (kiemTraThongTin(t)) {
			if (HoKhauDao.instance.insert(t) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Them ho khau", "", "");
				return true;
			}
		}
		return false;
	}

	public static boolean xoaHoKhau(String taiKhoan, String id) {
		if (HoKhauDao.instance.delete(id) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa ho khau", "", "");
			return true;
		}
		return false;
	}

	public static boolean luuBienDong(String taiKhoan, HoKhau t) {
		if (kiemTraThongTin(t)) {
			if (HoKhauDao.instance.update(t.getMaHoKhau(), new String[] { "SoCanHo", "DienTich", "SoNguoi", "ChuHo" },
					new Object[] { t.getSoCanHo(), (Double) t.getDienTich(), (Integer) t.getSoNguoi(),
							t.getChuHo() }) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Cap nhat thong tin ho khau", "", "");
				return true;
			}
		}
		return false;
	}

	public static boolean kiemTraTonTai(String id) {
		if (HoKhauDao.instance.selectByID(id) != null) {
			return true;
		}
		return false;
	}

	public static HoKhau layThongTinHoKhau(String id) {
		return HoKhauDao.instance.selectByID(id);
	}

	public static boolean kiemTraThongTin(HoKhau t) {
		return Validator.validLength(t.getSoCanHo(), 20, false)
				&& NhanKhauDao.instance.selectByID(t.getChuHo()) != null;
	}

	public static HoKhau traCuuThongTin(String userId) {
		return HoKhauDao.instance.selectByID(userId);
	}

	public static ThongKeHoKhau thongKeHoKhau() {
		return HoKhauDao.instance.thongKe();
	}

}
