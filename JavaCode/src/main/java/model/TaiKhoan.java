package model;

import java.util.Objects;

public class TaiKhoan {

	private String maTaiKhoan;
	private String email;
	private String matKhau;
	private String tenNguoiDung;
	private String soDienThoai;
	private int vaiTro;
	private String maNhanKhau;
	private boolean trangThai;

	public TaiKhoan() {
		vaiTro = VaiTro.KE_TOAN;
		trangThai = false;
	}

	public TaiKhoan(String maTaiKhoan, String email, String matKhau, String tenNguoiDung, String soDienThoai,
			int vaiTro, String maNhanKhau, boolean trangThai) {
		this.maTaiKhoan = maTaiKhoan;
		this.email = email;
		this.matKhau = matKhau;
		this.tenNguoiDung = tenNguoiDung;
		this.soDienThoai = soDienThoai;
		this.vaiTro = vaiTro;
		this.maNhanKhau = maNhanKhau;
		this.trangThai = trangThai;
	}

	public String getMaTaiKhoan() {
		return maTaiKhoan;
	}

	public void setMaTaiKhoan(String maTaiKhoan) {
		this.maTaiKhoan = maTaiKhoan;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMatKhau() {
		return matKhau;
	}

	public void setMatKhau(String matKhau) {
		this.matKhau = matKhau;
	}

	public String getTenNguoiDung() {
		return tenNguoiDung;
	}

	public void setTenNguoiDung(String tenNguoiDung) {
		this.tenNguoiDung = tenNguoiDung;
	}

	public String getSoDienThoai() {
		return soDienThoai;
	}

	public void setSoDienThoai(String soDienThoai) {
		this.soDienThoai = soDienThoai;
	}

	public int getVaiTro() {
		return vaiTro;
	}

	public void setVaiTro(int vaiTro) {
		this.vaiTro = vaiTro;
	}

	public String getMaNhanKhau() {
		return maNhanKhau;
	}

	public void setMaNhanKhau(String maNhanKhau) {
		this.maNhanKhau = maNhanKhau;
	}

	public boolean isTrangThai() {
		return trangThai;
	}

	public void setTrangThai(boolean trangThai) {
		this.trangThai = trangThai;
	}

	@Override
	public String toString() {
		return "TaiKhoan [maTaiKhoan=" + maTaiKhoan + ", email=" + email + ", matKhau=" + matKhau + ", tenNguoiDung="
				+ tenNguoiDung + ", soDienThoai=" + soDienThoai + ", vaiTro=" + vaiTro + ", maNhanKhau=" + maNhanKhau
				+ ", trangThai=" + trangThai + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(email, maNhanKhau, maTaiKhoan, matKhau, soDienThoai, tenNguoiDung, trangThai, vaiTro);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TaiKhoan other = (TaiKhoan) obj;
		return Objects.equals(email, other.email) && Objects.equals(maNhanKhau, other.maNhanKhau)
				&& Objects.equals(maTaiKhoan, other.maTaiKhoan) && Objects.equals(matKhau, other.matKhau)
				&& Objects.equals(soDienThoai, other.soDienThoai) && Objects.equals(tenNguoiDung, other.tenNguoiDung)
				&& trangThai == other.trangThai && Objects.equals(vaiTro, other.vaiTro);
	}

	public static class VaiTro {

		public static final int KE_TOAN = 0;
		public static final int TO_TRUONG = 1;
		public static final int NGUOI_DUNG = 2;

		public static String toString(int vaiTro) {
			switch (vaiTro) {
			case KE_TOAN:
				return "Kế toán";
			case TO_TRUONG:
				return "Tổ trưởng/Tổ phó";
			case NGUOI_DUNG:
				return "Nguoi dung";
			default:
				return "";
			}
		}

	}
}
