package model;

import java.sql.Date;
import java.util.Objects;

public class TamTruTamVang {

	private String maTamTruTamVang;
	private String maNhanKhau;
	private int loai;
	private String noiTamTruTamVang;
	private Date tuNgay;
	private Date denNgay;

	public TamTruTamVang(String maTamTruTamVang, String maNhanKhau, int loai, String noiTamTruTamVang, Date tuNgay,
			Date denNgay) {
		super();
		this.maTamTruTamVang = maTamTruTamVang;
		this.maNhanKhau = maNhanKhau;
		this.loai = loai;
		this.noiTamTruTamVang = noiTamTruTamVang;
		this.tuNgay = tuNgay;
		this.denNgay = denNgay;
	}

	public String getMaTamTruTamVang() {
		return maTamTruTamVang;
	}

	public void setMaTamTruTamVang(String maTamTruTamVang) {
		this.maTamTruTamVang = maTamTruTamVang;
	}

	public String getMaNhanKhau() {
		return maNhanKhau;
	}

	public void setMaNhanKhau(String maNhanKhau) {
		this.maNhanKhau = maNhanKhau;
	}

	public int getLoai() {
		return loai;
	}

	public void setLoai(int loai) {
		this.loai = loai;
	}

	public String getNoiTamTruTamVang() {
		return noiTamTruTamVang;
	}

	public void setNoiTamTruTamVang(String noiTamTruTamVang) {
		this.noiTamTruTamVang = noiTamTruTamVang;
	}

	public Date getTuNgay() {
		return tuNgay;
	}

	public void setTuNgay(Date tuNgay) {
		this.tuNgay = tuNgay;
	}

	public Date getDenNgay() {
		return denNgay;
	}

	public void setDenNgay(Date denNgay) {
		this.denNgay = denNgay;
	}

	@Override
	public int hashCode() {
		return Objects.hash(denNgay, loai, maNhanKhau, maTamTruTamVang, noiTamTruTamVang, tuNgay);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TamTruTamVang other = (TamTruTamVang) obj;
		return Objects.equals(denNgay, other.denNgay) && Objects.equals(loai, other.loai)
				&& Objects.equals(maNhanKhau, other.maNhanKhau)
				&& Objects.equals(maTamTruTamVang, other.maTamTruTamVang)
				&& Objects.equals(noiTamTruTamVang, other.noiTamTruTamVang) && Objects.equals(tuNgay, other.tuNgay);
	}

}
