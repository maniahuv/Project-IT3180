package model;

import java.util.Objects;

public class TaiKhoan {

	public static final int NO_ACCESS = 0;
	public static final int FINANCE_ACCESS = 1;
	public static final int FULL_ACCESS = 2;

	private String maTaiKhoan;
	private String email;
	private String matKhau;
	private String tenNguoiDung;
	private String soDienThoai;
	private VaiTro vaiTro;
	private String maNhanKhau;
	private boolean trangThai;

	public TaiKhoan() {
	}

	public TaiKhoan(String maTaiKhoan, String email, String matKhau, String tenNguoiDung, String soDienThoai,
			VaiTro vaiTro, String maNhanKhau, boolean trangThai) {
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

	public VaiTro getVaiTro() {
		return vaiTro;
	}

	public void setVaiTro(VaiTro vaiTro) {
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

	public enum VaiTro {
		KE_TOAN, TO_TRUONG, TO_PHO;

		@Override
		public String toString() {
			switch (this) {
			case KE_TOAN:
				return "Kế toán";
			case TO_TRUONG:
				return "Tổ trưởng";
			case TO_PHO:
				return "Tổ phó";
			default:
				return super.toString();
			}
		}

		public static VaiTro get(String string) {
			switch (string) {
			case "Kế toán":
				return KE_TOAN;
			case "Tổ trưởng":
				return TO_TRUONG;
			case "Tổ phó":
				return TO_PHO;
			default:
				return null;
			}
		}
	}
}
