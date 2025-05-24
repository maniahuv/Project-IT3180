package model;

import java.sql.Date;

public class DotThu {

	public static class TrangThaiDotThu {
		public static final int DANG_DIEN_RA = 0;
		public static final int DA_KET_THUC = 1;

		public static String toString(int vaiTro) {
			switch (vaiTro) {
			case DANG_DIEN_RA:
				return "Đang diễn ra";
			case DA_KET_THUC:
				return "Đã kết thúc";
			default:
				return "";
			}
		}

	}

	private String maDotThu;
	private String tenDotThu;
	private Date thoiGianBatDau;
	private Date thoiGianKetThuc;
	private String moTa;
	private int trangThai;

	// Constructor đầy đủ
	public DotThu(String maDotThu, String tenDotThu, Date thoiGianBatDau, Date thoiGianKetThuc, String moTa,
			int trangThai) {
		this.maDotThu = maDotThu;
		this.tenDotThu = tenDotThu;
		this.thoiGianBatDau = thoiGianBatDau;
		this.thoiGianKetThuc = thoiGianKetThuc;
		this.moTa = moTa;
		this.trangThai = trangThai;
	}

	// Getter và Setter
	public String getMaDotThu() {
		return maDotThu;
	}

	public void setMaDotThu(String maDotThu) {
		this.maDotThu = maDotThu;
	}

	public String getTenDotThu() {
		return tenDotThu;
	}

	public void setTenDotThu(String tenDotThu) {
		this.tenDotThu = tenDotThu;
	}

	public Date getThoiGianBatDau() {
		return thoiGianBatDau;
	}

	public void setThoiGianBatDau(Date thoiGianBatDau) {
		this.thoiGianBatDau = thoiGianBatDau;
	}

	public Date getThoiGianKetThuc() {
		return thoiGianKetThuc;
	}

	public void setThoiGianKetThuc(Date thoiGianKetThuc) {
		this.thoiGianKetThuc = thoiGianKetThuc;
	}

	public String getMoTa() {
		return moTa;
	}

	public void setMoTa(String moTa) {
		this.moTa = moTa;
	}

	public int getTrangThai() {
		return trangThai;
	}

	public void setTrangThai(int trangThai) {
		this.trangThai = trangThai;
	}
}
