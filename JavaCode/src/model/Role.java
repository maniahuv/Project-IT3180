package model;

public enum Role {

	KHACH("id", "khach"), TO_TRUONG("id", "totrg"), KE_TOAN("id", "ketoan");

	private String idRole;
	private String tenRole;

	Role(String idRole, String tenRole) {
		this.idRole = idRole;
		this.tenRole = tenRole;
	}

	public String getIdRole() {
		return idRole;
	}

	public String getTenRole() {
		return tenRole;
	}

	public void setIdRole(String idRole) {
		this.idRole = idRole;
	}

	public void setTenRole(String tenRole) {
		this.tenRole = tenRole;
	}

}
