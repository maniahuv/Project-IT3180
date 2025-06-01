package service;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import model.TaiKhoan;
import model.TaiKhoan.VaiTro;
import repository.NhanKhauDao;
import repository.TaiKhoanDao;
import utils.TaiKhoanDetails;
import utils.Validator;

@Service
public class TaiKhoanService implements UserDetailsService {

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		System.out.println("Authorizing user");
		if ("admin@example.com".equals(email)) {
			System.out.println("Returning admin user");
			return User.withUsername("admin@example.com").password("{noop}password").roles("TO_TRUONG").build();
		}
		TaiKhoan taiKhoan = timTaiKhoan(email);
		if (taiKhoan != null) {
			System.out.println("Tai khoan found");
			List<GrantedAuthority> authorities = List
					.of(new SimpleGrantedAuthority(VaiTro.toString(taiKhoan.getVaiTro())));
			return new TaiKhoanDetails(taiKhoan.getMaTaiKhoan(), taiKhoan.getEmail(),
					String.format("{noop}%s", taiKhoan.getMatKhau()), authorities);
		}
		System.out.println("Tai khoan not found");
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
		if (!Validator.validEmail(t.getEmail())) {
			System.out.println("Email ko hop le");
			return false;
		}
		if (!Validator.validLength(t.getMatKhau(), 100, false)) {
			System.out.println("Mat khau ko hop le");
			return false;
		}
		if (!Validator.validLength(t.getTenNguoiDung(), 100, true)) {
			System.out.println("Ten nguoi dung ko hop le");
			return false;
		}
		if (!Validator.validLength(t.getSoDienThoai(), 15, true)) {
			System.out.println("So dien thoai ko hop le");
			return false;
		}
		if (VaiTro.toString(t.getVaiTro()).length() <= 0) {
			System.out.println("Vai tro ko hop le");
			return false;
		}
		if (NhanKhauDao.instance.selectByID(t.getMaNhanKhau()) == null) {
			System.out.println("Ma nhan khau ko ton tai");
			return false;
		}
		return true;
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
