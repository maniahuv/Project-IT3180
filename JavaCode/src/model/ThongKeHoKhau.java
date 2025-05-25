package model;

public class ThongKeHoKhau {
	private int totalDienTich;
	private int totalSoNguoi;

	public ThongKeHoKhau(int totalDienTich, int totalSoNguoi) {
		this.totalDienTich = totalDienTich;
		this.totalSoNguoi = totalSoNguoi;
	}

	@Override
	public String toString() {
		return String.format("ThongKeHoKhau [totalDienTich=%d, totalSoNguoi=%d]", totalDienTich, totalSoNguoi);
	}

	public int getTotalDienTich() {
		return totalDienTich;
	}

	public void setTotalDienTich(int totalDienTich) {
		this.totalDienTich = totalDienTich;
	}

	public int getTotalSoNguoi() {
		return totalSoNguoi;
	}

	public void setTotalSoNguoi(int totalSoNguoi) {
		this.totalSoNguoi = totalSoNguoi;
	}

}
