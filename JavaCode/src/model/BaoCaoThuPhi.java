package model;

import java.sql.Date;
import java.util.Objects;

public class BaoCaoThuPhi {

	private String maBaoCao;
	private String tieuDe;
	private Date ngayTao;
	private String maTaiKhoan;
	private String maDotThu;
	private String duLieuTongHop;
	private String duongDanFile;

	public BaoCaoThuPhi(String maBaoCao, String tieuDe, Date ngayTao, String maTaiKhoan, String maDotThu,
			String duLieuTongHop, String duongDanFile) {
		super();
		this.maBaoCao = maBaoCao;
		this.tieuDe = tieuDe;
		this.ngayTao = ngayTao;
		this.maTaiKhoan = maTaiKhoan;
		this.maDotThu = maDotThu;
		this.duLieuTongHop = duLieuTongHop;
		this.duongDanFile = duongDanFile;
	}

	public String getMaBaoCao() {
		return maBaoCao;
	}

	public void setMaBaoCao(String maBaoCao) {
		this.maBaoCao = maBaoCao;
	}

	public String getTieuDe() {
		return tieuDe;
	}

	public void setTieuDe(String tieuDe) {
		this.tieuDe = tieuDe;
	}

	public Date getNgayTao() {
		return ngayTao;
	}

	public void setNgayTao(Date ngayTao) {
		this.ngayTao = ngayTao;
	}

	public String getMaTaiKhoan() {
		return maTaiKhoan;
	}

	public void setMaTaiKhoan(String maTaiKhoan) {
		this.maTaiKhoan = maTaiKhoan;
	}

	public String getMaDotThu() {
		return maDotThu;
	}

	public void setMaDotThu(String maDotThu) {
		this.maDotThu = maDotThu;
	}

	public String getDuLieuTongHop() {
		return duLieuTongHop;
	}

	public void setDuLieuTongHop(String duLieuTongHop) {
		this.duLieuTongHop = duLieuTongHop;
	}

	public String getDuongDanFile() {
		return duongDanFile;
	}

	public void setDuongDanFile(String duongDanFile) {
		this.duongDanFile = duongDanFile;
	}

	@Override
	public int hashCode() {
		return Objects.hash(duLieuTongHop, duongDanFile, maBaoCao, maDotThu, maTaiKhoan, ngayTao, tieuDe);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BaoCaoThuPhi other = (BaoCaoThuPhi) obj;
		return Objects.equals(duLieuTongHop, other.duLieuTongHop) && Objects.equals(duongDanFile, other.duongDanFile)
				&& Objects.equals(maBaoCao, other.maBaoCao) && Objects.equals(maDotThu, other.maDotThu)
				&& Objects.equals(maTaiKhoan, other.maTaiKhoan) && Objects.equals(ngayTao, other.ngayTao)
				&& Objects.equals(tieuDe, other.tieuDe);
	}

}
