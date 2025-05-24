package model;

import java.util.Objects;

public class HoKhau {

	private String maHoKhau;
	private String soCanHo; // So CCCD
	private Double dienTich;
	private int soNguoi;
	private String chuHo;

	public HoKhau(String maHoKhau, String soCanHo, double dienTich, int soNguoi, String chuHo) {
		this.maHoKhau = maHoKhau;
		this.soCanHo = soCanHo;
		this.dienTich = dienTich;
		this.soNguoi = soNguoi;
		this.chuHo = chuHo;
	}

	public String getMaHoKhau() {
		return maHoKhau;
	}

	public void setMaHoKhau(String maHoKhau) {
		this.maHoKhau = maHoKhau;
	}

	public String getSoCanHo() {
		return soCanHo;
	}

	public void setSoCanHo(String soCanHo) {
		this.soCanHo = soCanHo;
	}

	public Double getDienTich() {
		return dienTich;
	}

	public void setDienTich(Double dienTich) {
		this.dienTich = dienTich;
	}

	public int getSoNguoi() {
		return soNguoi;
	}

	public void setSoNguoi(int soNguoi) {
		this.soNguoi = soNguoi;
	}

	public String getChuHo() {
		return chuHo;
	}

	public void setChuHo(String chuHo) {
		this.chuHo = chuHo;
	}

	@Override
	public String toString() {
		return "HoKhau [maHoKhau=" + maHoKhau + ", soCanHo=" + soCanHo + ", dienTich=" + dienTich + ", soNguoi="
				+ soNguoi + ", chuHo=" + chuHo + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(chuHo, dienTich, maHoKhau, soCanHo, soNguoi);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		HoKhau other = (HoKhau) obj;
		return Objects.equals(chuHo, other.chuHo) && Objects.equals(dienTich, other.dienTich)
				&& Objects.equals(maHoKhau, other.maHoKhau) && Objects.equals(soCanHo, other.soCanHo)
				&& soNguoi == other.soNguoi;
	}

}
