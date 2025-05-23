package model;

import java.sql.Date;
import java.util.Objects;

public class LichSuGiaoDich {

	private String maLichSu;
	private Date thoiGian;
	private String hanhDong;
	private String maTaiKhoan;
	private String doiTuongLienQuan;
	private String moTaChiTiet;

	public LichSuGiaoDich(String maLichSu, Date thoiGian, String hanhDong, String maTaiKhoan, String doiTuongLienQuan,
			String moTaChiTiet) {
		super();
		this.maLichSu = maLichSu;
		this.thoiGian = thoiGian;
		this.hanhDong = hanhDong;
		this.maTaiKhoan = maTaiKhoan;
		this.doiTuongLienQuan = doiTuongLienQuan;
		this.moTaChiTiet = moTaChiTiet;
	}

	public String getMaLichSu() {
		return maLichSu;
	}

	public void setMaLichSu(String maLichSu) {
		this.maLichSu = maLichSu;
	}

	public Date getThoiGian() {
		return thoiGian;
	}

	public void setThoiGian(Date thoiGian) {
		this.thoiGian = thoiGian;
	}

	public String getHanhDong() {
		return hanhDong;
	}

	public void setHanhDong(String hanhDong) {
		this.hanhDong = hanhDong;
	}

	public String getMaTaiKhoan() {
		return maTaiKhoan;
	}

	public void setMaTaiKhoan(String maTaiKhoan) {
		this.maTaiKhoan = maTaiKhoan;
	}

	public String getDoiTuongLienQuan() {
		return doiTuongLienQuan;
	}

	public void setDoiTuongLienQuan(String doiTuongLienQuan) {
		this.doiTuongLienQuan = doiTuongLienQuan;
	}

	public String getMoTaChiTiet() {
		return moTaChiTiet;
	}

	public void setMoTaChiTiet(String moTaChiTiet) {
		this.moTaChiTiet = moTaChiTiet;
	}

	@Override
	public int hashCode() {
		return Objects.hash(doiTuongLienQuan, hanhDong, maLichSu, maTaiKhoan, moTaChiTiet, thoiGian);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LichSuGiaoDich other = (LichSuGiaoDich) obj;
		return Objects.equals(doiTuongLienQuan, other.doiTuongLienQuan) && Objects.equals(hanhDong, other.hanhDong)
				&& Objects.equals(maLichSu, other.maLichSu) && Objects.equals(maTaiKhoan, other.maTaiKhoan)
				&& Objects.equals(moTaChiTiet, other.moTaChiTiet) && Objects.equals(thoiGian, other.thoiGian);
	}

}
