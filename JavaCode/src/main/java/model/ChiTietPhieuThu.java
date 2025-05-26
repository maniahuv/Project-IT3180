package model;

import java.util.Objects;

public class ChiTietPhieuThu {

	private String maPhieuThu;
	private String maKhoanThu;
	private String soTienThu;
	private String ghiChu;

	public ChiTietPhieuThu(String maPhieuThu, String maKhoanThu, String soTienThu, String ghiChu) {
		super();
		this.maPhieuThu = maPhieuThu;
		this.maKhoanThu = maKhoanThu;
		this.soTienThu = soTienThu;
		this.ghiChu = ghiChu;
	}

	public String getMaPhieuThu() {
		return maPhieuThu;
	}

	public void setMaPhieuThu(String maPhieuThu) {
		this.maPhieuThu = maPhieuThu;
	}

	public String getMaKhoanThu() {
		return maKhoanThu;
	}

	public void setMaKhoanThu(String maKhoanThu) {
		this.maKhoanThu = maKhoanThu;
	}

	public String getSoTienThu() {
		return soTienThu;
	}

	public void setSoTienThu(String soTienThu) {
		this.soTienThu = soTienThu;
	}

	public String getGhiChu() {
		return ghiChu;
	}

	public void setGhiChu(String ghiChu) {
		this.ghiChu = ghiChu;
	}

	@Override
	public int hashCode() {
		return Objects.hash(ghiChu, maKhoanThu, maPhieuThu, soTienThu);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ChiTietPhieuThu other = (ChiTietPhieuThu) obj;
		return Objects.equals(ghiChu, other.ghiChu) && Objects.equals(maKhoanThu, other.maKhoanThu)
				&& Objects.equals(maPhieuThu, other.maPhieuThu) && Objects.equals(soTienThu, other.soTienThu);
	}

}
