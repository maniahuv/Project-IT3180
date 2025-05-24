package model;

import java.sql.Date;
import java.util.Objects;

public class NhanKhau {

	private String maNhanKhau;
	private String hoTen;
	private String soCCCD;
	private Date ngaySinh;
	private int gioiTinh;
	private String ngheNghiep;
	private int quanHeVoiChuHo;
	private int tinhTrangCuTru;
	private String maHoKhau;

	// Constructor
	public NhanKhau(String maNhanKhau, String hoTen, String soCCCD, Date ngaySinh, int gioiTinh, String ngheNghiep,
			int quanHeVoiChuHo, int tinhTrangCuTru, String maHoKhau) {
		this.maNhanKhau = maNhanKhau;
		this.hoTen = hoTen;
		this.soCCCD = soCCCD;
		this.ngaySinh = ngaySinh;
		this.gioiTinh = gioiTinh;
		this.ngheNghiep = ngheNghiep;
		this.quanHeVoiChuHo = quanHeVoiChuHo;
		this.tinhTrangCuTru = tinhTrangCuTru;
		this.maHoKhau = maHoKhau;
	}

	// Getters và Setters
	public String getMaNhanKhau() {
		return maNhanKhau;
	}

	public void setMaNhanKhau(String maNhanKhau) {
		this.maNhanKhau = maNhanKhau;
	}

	public String getHoTen() {
		return hoTen;
	}

	public void setHoTen(String hoTen) {
		this.hoTen = hoTen;
	}

	public String getSoCCCD() {
		return soCCCD;
	}

	public void setSoCCCD(String soCCCD) {
		this.soCCCD = soCCCD;
	}

	public Date getNgaySinh() {
		return ngaySinh;
	}

	public void setNgaySinh(Date ngaySinh) {
		this.ngaySinh = ngaySinh;
	}

	public int getGioiTinh() {
		return gioiTinh;
	}

	public void setGioiTinh(int gioiTinh) {
		this.gioiTinh = gioiTinh;
	}

	public String getNgheNghiep() {
		return ngheNghiep;
	}

	public void setNgheNghiep(String ngheNghiep) {
		this.ngheNghiep = ngheNghiep;
	}

	public int getQuanHeVoiChuHo() {
		return quanHeVoiChuHo;
	}

	public void setQuanHeVoiChuHo(int quanHeVoiChuHo) {
		this.quanHeVoiChuHo = quanHeVoiChuHo;
	}

	public int getTinhTrangCuTru() {
		return tinhTrangCuTru;
	}

	public void setTinhTrangCuTru(int tinhTrangCuTru) {
		this.tinhTrangCuTru = tinhTrangCuTru;
	}

	public String getMaHoKhau() {
		return maHoKhau;
	}

	public void setMaHoKhau(String maHoKhau) {
		this.maHoKhau = maHoKhau;
	}

	@Override
	public String toString() {
		return "NhanKhau [maNhanKhau=" + maNhanKhau + ", hoTen=" + hoTen + ", soCCCD=" + soCCCD + ", ngaySinh="
				+ ngaySinh + ", gioiTinh=" + gioiTinh + ", ngheNghiep=" + ngheNghiep + ", quanHeVoiChuHo="
				+ quanHeVoiChuHo + ", tinhTrangCuTru=" + tinhTrangCuTru + ", maHoKhau=" + maHoKhau + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(maNhanKhau, hoTen, soCCCD, ngaySinh, gioiTinh, ngheNghiep, quanHeVoiChuHo, tinhTrangCuTru,
				maHoKhau);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;
		NhanKhau other = (NhanKhau) obj;
		return Objects.equals(maNhanKhau, other.maNhanKhau) && Objects.equals(hoTen, other.hoTen)
				&& Objects.equals(soCCCD, other.soCCCD) && Objects.equals(ngaySinh, other.ngaySinh)
				&& gioiTinh == other.gioiTinh && Objects.equals(ngheNghiep, other.ngheNghiep)
				&& quanHeVoiChuHo == other.quanHeVoiChuHo && tinhTrangCuTru == other.tinhTrangCuTru
				&& Objects.equals(maHoKhau, other.maHoKhau);
	}

	// Enums
	public static class GioiTinh {
		public static final int NAM = 0;
		public static final int NU = 1;
		public static final int KHAC = 2;

		public static String toString(int vaiTro) {
			switch (vaiTro) {
			case NAM:
				return "Nam";
			case NU:
				return "Nữ";
			case KHAC:
				return "Khác";
			default:
				return "";
			}
		}

	}

	public static class QuanHeVoiChuHo {
		public static final int CHU_HO = 0;
		public static final int VO_CHONG = 1;
		public static final int CON = 2;
		public static final int CHA_ME = 3;
		public static final int ANH_CHI_EM = 4;
		public static final int KHAC = 5;

		public static String toString(int vaiTro) {
			switch (vaiTro) {
			case CHU_HO:
				return "Chủ hộ";
			case VO_CHONG:
				return "Vợ/Chồng";
			case CON:
				return "Con";
			case CHA_ME:
				return "Cha/Mẹ";
			case ANH_CHI_EM:
				return "Anh/Chị/Em";
			case KHAC:
				return "Khác";
			default:
				return "";
			}
		}

	}

	public static class TinhTrangCuTru {
		public static final int DANG_O = 0;
		public static final int TAM_VANG = 1;

		public static String toString(int vaiTro) {
			switch (vaiTro) {
			case DANG_O:
				return "Đang ở";
			case TAM_VANG:
				return "Tạm vắng";
			default:
				return "";
			}
		}

	}
}
