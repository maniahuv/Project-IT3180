package model;

public class ThongKeKhoanThu {
	private int totalKhoanThu;
    private int soDaThanhToan;
    private int soChuaThanhToan;
    private int soQuaHanChuaThanhToan;

    public ThongKeKhoanThu(int totalKhoanThu , int soDaThanhToan, int soChuaThanhToan, int soQuaHanChuaThanhToan ) {
        this.totalKhoanThu    =totalKhoanThu;
        this.soDaThanhToan  = soDaThanhToan;
        this.soChuaThanhToan    = soChuaThanhToan;
        this.soQuaHanChuaThanhToan=soQuaHanChuaThanhToan;
    }

	public int getTotalKhoanThu() {
		return totalKhoanThu;
	}

	public void setTotalKhoanThu(int totalKhoanThu) {
		this.totalKhoanThu = totalKhoanThu;
	}

	public int getSoDaThanhToan() {
		return soDaThanhToan;
	}

	public void setSoDaThanhToan(int soDaThanhToan) {
		this.soDaThanhToan = soDaThanhToan;
	}

	public int getSoChuaThanhToan() {
		return soChuaThanhToan;
	}

	public void setSoChuaThanhToan(int soChuaThanhToan) {
		this.soChuaThanhToan = soChuaThanhToan;
	}

	public int getSoQuaHanChuaThanhToan() {
		return soQuaHanChuaThanhToan;
	}

	public void setSoQuaHanChuaThanhToan(int soQuaHanChuaThanhToan) {
		this.soQuaHanChuaThanhToan = soQuaHanChuaThanhToan;
	}

	@Override
	public String toString() {
		return "ThongKeKhoanThu [totalKhoanThu=" + totalKhoanThu + ", soDaThanhToan=" + soDaThanhToan
				+ ", soChuaThanhToan=" + soChuaThanhToan + ", soQuaHanChuaThanhToan=" + soQuaHanChuaThanhToan + "]";
	}

    
}
