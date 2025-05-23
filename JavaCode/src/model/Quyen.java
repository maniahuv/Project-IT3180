package model;

public class Quyen {

	private String idQuyen;
	private TenQuyen tenQuyen;

	Quyen(String idQuyen, TenQuyen tenQuyen) {
		this.idQuyen = idQuyen;
		this.tenQuyen = tenQuyen;
	}

	public String getIdQuyen() {
		return idQuyen;
	}

	public TenQuyen getTenQuyen() {
		return tenQuyen;
	}

	public void setIdQuyen(String idQuyen) {
		this.idQuyen = idQuyen;
	}

	public void setTenQuyen(TenQuyen tenQuyen) {
		this.tenQuyen = tenQuyen;
	}

	public enum TenQuyen {

		XEM("xem"), SUA("sua");

		private final String tenQuyen;

		TenQuyen(String tenQuyen) {
			this.tenQuyen = tenQuyen;
		}

		@Override
		public String toString() {
			return tenQuyen;
		}

	}

}
