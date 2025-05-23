package model;

import java.sql.Date;
import java.util.Objects;

public class PhieuThu {
	private String maPhieuThu;
	private String maHoKhau;
	private String maDotThu;
	private Date ngayThu;
	private double tongTien;
    private TrangThai trangThai;
    private String duongDanDuongTep;
    
    public PhieuThu(String maPhieuThu, String maHoKhau, String maDotThu, Date ngayThu,
            double tongTien, TrangThai trangThai, String duongDanDuongTep) {
	this.maPhieuThu = maPhieuThu;
	this.maHoKhau = maHoKhau;
	this.maDotThu = maDotThu;
	this.ngayThu = ngayThu;
	this.tongTien = tongTien;
	this.trangThai = trangThai;
	this.duongDanDuongTep = duongDanDuongTep;
}

	public String getMaPhieuThu() {
		return maPhieuThu;
	}
	public void setMaPhieuThu(String maPhieuThu) {
		this.maPhieuThu = maPhieuThu;
	}
	public String getMaHoKhau() {
		return maHoKhau;
	}
	public void setMaHoKhau(String maHoKhau) {
		this.maHoKhau = maHoKhau;
	}
	public String getMaDotThu() {
		return maDotThu;
	}
	public void setMaDotThu(String maDotThu) {
		this.maDotThu = maDotThu;
	}
	public Date getNgayThu() {
		return ngayThu;
	}
	public void setNgayThu(Date ngayThu) {
		this.ngayThu = ngayThu;
	}
	public double getTongTien() {
		return tongTien;
	}
	public void setTongTien(double tongTien) {
		this.tongTien = tongTien;
	}
	public TrangThai getTrangThai() {
		return trangThai;
	}
	public void setTrangThai(TrangThai trangThai) {
		this.trangThai = trangThai;
	}
	public String getDuongDanDuongTep() {
		return duongDanDuongTep;
	}
	public void setDuongDanDuongTep(String duongDanDuongTep) {
		this.duongDanDuongTep = duongDanDuongTep;
	}
	@Override
	public String toString() {
		return "PhieuThu [maPhieuThu=" + maPhieuThu + ", maHoKhau=" + maHoKhau + ", maDotThu=" + maDotThu + ", ngayThu="
				+ ngayThu + ", tongTien=" + tongTien + ", trangThai=" + trangThai + ", duongDanDuongTep="
				+ duongDanDuongTep + "]";
	}
	@Override
	public int hashCode() {
		return Objects.hash(duongDanDuongTep, maDotThu, maHoKhau, maPhieuThu, ngayThu, tongTien, trangThai);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PhieuThu other = (PhieuThu) obj;
		return Objects.equals(duongDanDuongTep, other.duongDanDuongTep) && Objects.equals(maDotThu, other.maDotThu)
				&& Objects.equals(maHoKhau, other.maHoKhau) && Objects.equals(maPhieuThu, other.maPhieuThu)
				&& Objects.equals(ngayThu, other.ngayThu)
				&& Double.doubleToLongBits(tongTien) == Double.doubleToLongBits(other.tongTien)
				&& Objects.equals(trangThai, other.trangThai);
	}
	public enum TrangThai {
        DA_THU,
       CHUA_THU;
        

        @Override
        public String toString() {
            switch (this) {
                case DA_THU: return "đã thu";
                case CHUA_THU: return "chưa thu";
               
                default: return super.toString();
            }
        }
	}
	

}
