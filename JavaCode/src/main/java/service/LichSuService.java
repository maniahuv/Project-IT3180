package service;

import java.sql.Date;

import model.LichSuGiaoDich;
import repository.LichSuGiaoDichDao;

public class LichSuService {

	public static boolean ghiNhanLichSu(String taiKhoan, String hanhDong, String doiTuongLienQuan, String moTaChiTiet) {
		if (LichSuGiaoDichDao.instance.insert(new LichSuGiaoDich(LichSuGiaoDichDao.instance.generateID(),
				new Date(System.currentTimeMillis()), hanhDong, taiKhoan, doiTuongLienQuan, moTaChiTiet)) > 0) {
			return true;
		}
		return false;
	}

}
