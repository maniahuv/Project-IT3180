package service;

import model.HoKhau;
import model.ThongKeHoKhau;
import repository.HoKhauDao;
import repository.NhanKhauDao;
import utils.Validator;

public class HoKhauService {

	private String taiKhoan;

	public HoKhauService(String taiKhoan) {
		super();
		this.taiKhoan = taiKhoan;
	}

	public boolean taoHoKhauMoi(HoKhau t) {
		if (kiemTraThongTin(t)) {
			if (HoKhauDao.instance.insert(t) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Them ho khau", "", "");
				return true;
			}
		}
		return false;
	}

	public boolean xoaHoKhau(String id) {
		if (HoKhauDao.instance.delete(id) > 0) {
			LichSuService.ghiNhanLichSu(taiKhoan, "Xoa ho khau", "", "");
			return true;
		}
		return false;
	}

	public boolean luuBienDong(HoKhau t) {
		if (kiemTraThongTin(t)) {
			if (HoKhauDao.instance.update(t.getMaHoKhau(), new String[] { "SoCanHo", "DienTich", "SoNguoi", "ChuHo" },
					new Object[] { t.getSoCanHo(), t.getDienTich(), t.getSoNguoi(), t.getChuHo() }) > 0) {
				LichSuService.ghiNhanLichSu(taiKhoan, "Cap nhat thong tin ho khau", "", "");
				return true;
			}
		}
		return false;
	}

	public boolean kiemTraTonTai(String id) {
		if (HoKhauDao.instance.selectByID(id) != null) {
			return true;
		}
		return false;
	}

	public HoKhau layThongTinHoKhau(String id) {
		return HoKhauDao.instance.selectByID(id);
	}

	public boolean kiemTraThongTin(HoKhau t) {
		return Validator.validLength(t.getSoCanHo(), 20, false)
				&& NhanKhauDao.instance.selectByID(t.getChuHo()) != null;
	}

	public HoKhau traCuuThongTin(String userId) {
		return HoKhauDao.instance.selectByID(userId);
	}

	public ThongKeHoKhau thongKeHoKhau() {
		return HoKhauDao.instance.thongKe();
	}

}
