package model;

public enum Quyen {

	XEM("id", "xem"), SUA("id", "sua");

	private String idQuyen;
	private String tenQuyen;

	Quyen(String idQuyen, String tenQuyen) {
		this.idQuyen = idQuyen;
		this.tenQuyen = tenQuyen;
	}

	public String getIdQuyen() {
		return idQuyen;
	}

	public String getTenQuyen() {
		return tenQuyen;
	}

	public void setIdQuyen(String idQuyen) {
		this.idQuyen = idQuyen;
	}

	public void setTenQuyen(String tenQuyen) {
		this.tenQuyen = tenQuyen;
	}

}
