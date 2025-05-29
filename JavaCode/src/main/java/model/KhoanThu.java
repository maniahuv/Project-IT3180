package model;

import java.sql.Date;
import java.util.Objects;

public class KhoanThu {

	private String maKhoanThu;
	private String maDotThu;
	private Double soTienPhaiNop;
	private Date ngayNop;
	private String tenKhoanThu;

	public KhoanThu(String maKhoanThu, String maDotThu, Double soTienPhaiNop, Date ngayNop, String tenKhoanThu) {
		super();
		this.maKhoanThu = maKhoanThu;
		this.maDotThu = maDotThu;
		this.soTienPhaiNop = soTienPhaiNop;
		this.ngayNop = ngayNop;
		this.tenKhoanThu = tenKhoanThu;
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

	public Double getSoTienPhaiNop() {
		return soTienPhaiNop;
	}

	public void setSoTienPhaiNop(Double soTienPhaiNop) {
		this.soTienPhaiNop = soTienPhaiNop;
	}

	public Date getNgayNop() {
		return ngayNop;
	}

	public void setNgayNop(Date ngayNop) {
		this.ngayNop = ngayNop;
	}

	public String getTenKhoanThu() {
		return tenKhoanThu;
	}

	public void setTenKhoanThu(String tenKhoanThu) {
		this.tenKhoanThu = tenKhoanThu;
	}

	@Override
	public int hashCode() {
		return Objects.hash(maDotThu, maKhoanThu, ngayNop, soTienPhaiNop, tenKhoanThu);
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
		return Objects.equals(maDotThu, other.maDotThu) && Objects.equals(maKhoanThu, other.maKhoanThu)
				&& Objects.equals(ngayNop, other.ngayNop) && Objects.equals(soTienPhaiNop, other.soTienPhaiNop)
				&& Objects.equals(tenKhoanThu, other.tenKhoanThu);
	}

	@Override
	public String toString() {
		return "KhoanThu [maKhoanThu=" + maKhoanThu + ", maDotThu=" + maDotThu + ", soTienPhaiNop=" + soTienPhaiNop
				+ ", ngayNop=" + ngayNop + ", tenKhoanThu=" + tenKhoanThu + "]";
	}

	public static class TrangThaiThanhToan {
		public static final int DA_NOP = 0;
		public static final int CHUA_NOP = 1;

		public static String toString(int id) {
			switch (id) {
			case DA_NOP:
				return "đã thu";
			case CHUA_NOP:
				return "chưa thu";
			default:
				return "";
			}
		}
	}

}
