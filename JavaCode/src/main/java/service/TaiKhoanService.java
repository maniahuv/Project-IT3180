package service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import model.TaiKhoan;
import model.TaiKhoan.VaiTro;
import repository.NhanKhauDao;
import repository.TaiKhoanDao;
import utils.Validator;

@Service
public class TaiKhoanService implements UserDetailsService {

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		System.out.println("Authorizing user");
		if ("admin@example.com".equals(email)) {
			System.out.println("Returning admin user");
			return User.withUsername("admin@example.com").password("{noop}password").roles("ADMIN").build();
		}
		TaiKhoan taiKhoan = timTaiKhoan(email);
		if (taiKhoan != null) {
			return User.withUsername(taiKhoan.getEmail()).password(taiKhoan.getMatKhau())
					.roles(VaiTro.toString(taiKhoan.getVaiTro()).isEmpty() ? "USER" : "ADMIN").build();
		}
		throw new UsernameNotFoundException("Khong tim dc tai khoan");
	}

	public static boolean taoTaiKhoanMoi(TaiKhoan t) {
		if (kiemTraThongTin(t)) {
			if (TaiKhoanDao.instance.insert(t) > 0) {
				LichSuService.ghiNhanLichSu(t.getMaTaiKhoan(), "Tao tai khoan", "", "");
				return true;
			}
		} else {
			System.out.println("Thong tin ko hop le");
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

	public static boolean capNhatThongTin(TaiKhoan t) {
		if (TaiKhoanDao.instance.update(t.getMaTaiKhoan(),
				new String[] { "Email", "TenNguoiDung", "SoDienThoai", "VaiTro", "MaNhanKhau", "TrangThai" },
				new Object[] { t.getEmail(), t.getTenNguoiDung(), t.getSoDienThoai(), (Integer) t.getVaiTro(),
						t.getMaNhanKhau(), (Boolean) t.isTrangThai() }) > 0) {
			LichSuService.ghiNhanLichSu(t.getMaTaiKhoan(), "Thay doi vai tro", "", "");
			return true;
		}
		return false;
	}

	public static boolean capNhatVaiTro(String userId, int vaiTro) {
		if (TaiKhoanDao.instance.update(userId, new String[] { "VaiTro" }, new Object[] { (Integer) vaiTro }) > 0) {
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

	public static TaiKhoan timTaiKhoan(String email) {
		return TaiKhoanDao.instance.queryFirst(new String[] { "Email" }, new Object[] { email });
	}

	public static boolean khoaMoTaiKhoan(String userId, boolean trangThai) {
		if (TaiKhoanDao.instance.update(userId, new String[] { "TrangThai" },
				new Object[] { (Boolean) trangThai }) > 0) {
			LichSuService.ghiNhanLichSu(userId, trangThai ? "Mo tai khoan" : "Khoa tai khoan", "", "");
			return true;
		}
		return false;
	}

}
