package model;

import java.sql.Date;
import java.util.Objects;

public class KhoanThu {

	public static final int PAID = 0;
	public static final int PARTIAL_PAID = 1;
	public static final int UNPAID = 2;

	private String maKhoanThu;
	private String maDotThu;
	private String maHoKhau;
	private String maLoaiKHoanThu ;
	private Double soTienPhaiNop;
	private String trangThaiThanhToan;
	private Date ngayNop;
	public enum TrangThai {
        DA_NOP,
       CHUA_NOP;
        

        @Override
        public String toString() {
            switch (this) {
                case DA_NOP: return "đã thu";
                case CHUA_NOP: return "chưa thu";
               
                default: return super.toString();
            }
        }
	}

	public KhoanThu(String maKhoanThu, String maDotThu, String maHoKhau, String maLoaiKHoanThu ,  Double soTienPhaiNop,String trangThaiThanhToan, Date ngayNop) {
		this.maKhoanThu=maKhoanThu;
		this.maDotThu = maDotThu;
		this.maHoKhau = maHoKhau;
		this. maLoaiKHoanThu =  maLoaiKHoanThu;
		this.soTienPhaiNop= soTienPhaiNop;
		this.trangThaiThanhToan = trangThaiThanhToan;
		this.ngayNop = ngayNop;
	}

	public String getMaKhoanThu() {
		return maKhoanThu;
	}

	public void setMaKhoanThu(String maKhoanThu) {
		this.maKhoanThu = maKhoanThu;
	}

	public String getMaDotThu() {
		return maDotThu;
	}

	public void setMaDotThu(String maDotThu) {
		this.maDotThu = maDotThu;
	}

	public String getMaHoKhau() {
		return maHoKhau;
	}

	public void setMaHoKhau(String maHoKhau) {
		this.maHoKhau = maHoKhau;
	}

	public String getMaLoaiKHoanThu() {
		return maLoaiKHoanThu;
	}

	public void setMaLoaiKHoanThu(String maLoaiKHoanThu) {
		this.maLoaiKHoanThu = maLoaiKHoanThu;
	}

	public Double getSoTienPhaiNop() {
		return soTienPhaiNop;
	}

	public void setSoTienPhaiNop(Double soTienPhaiNop) {
		this.soTienPhaiNop = soTienPhaiNop;
	}

	public String getTrangThaiThanhToan() {
		return trangThaiThanhToan;
	}

	public void setTrangThaiThanhToan(String trangThaiThanhToan) {
		this.trangThaiThanhToan = trangThaiThanhToan;
	}

	public Date getNgayNop() {
		return ngayNop;
	}

	public void setNgayNop(Date ngayNop) {
		this.ngayNop = ngayNop;
	}

	@Override
	public String toString() {
		return "KhoanThu [maKhoanThu=" + maKhoanThu + ", maDotThu=" + maDotThu + ", maHoKhau=" + maHoKhau
				+ ", maLoaiKHoanThu=" + maLoaiKHoanThu + ", soTienPhaiNop=" + soTienPhaiNop + ", trangThaiThanhToan="
				+ trangThaiThanhToan + ", ngayNop=" + ngayNop + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(maDotThu, maHoKhau, maKhoanThu, maLoaiKHoanThu, ngayNop, soTienPhaiNop, trangThaiThanhToan);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		KhoanThu other = (KhoanThu) obj;
		return Objects.equals(maDotThu, other.maDotThu) && Objects.equals(maHoKhau, other.maHoKhau)
				&& Objects.equals(maKhoanThu, other.maKhoanThu) && Objects.equals(maLoaiKHoanThu, other.maLoaiKHoanThu)
				&& Objects.equals(ngayNop, other.ngayNop) && Objects.equals(soTienPhaiNop, other.soTienPhaiNop)
				&& Objects.equals(trangThaiThanhToan, other.trangThaiThanhToan);
	}

	

	
}
