package model;

public class Quyen {

	private String idQuyen;
	private int tenQuyen;

	public Quyen(String idQuyen, int tenQuyen) {
		this.idQuyen = idQuyen;
		this.tenQuyen = tenQuyen;
	}

	public String getIdQuyen() {
		return idQuyen;
	}

	public int getTenQuyen() {
		return tenQuyen;
	}

	public void setIdQuyen(String idQuyen) {
		this.idQuyen = idQuyen;
	}

	public void setTenQuyen(int tenQuyen) {
		this.tenQuyen = tenQuyen;
	}

	public static class TenQuyen {

		public static final int XEM = 0;
		public static final int SUA = 1;

		public static String toString(int id) {
			switch (id) {
			case XEM:
				return "xem";
			case SUA:
				return "sua";
			default:
				return "";
			}
		}

	}

}
