package model;

public class Role {

	private String idRole;
	private TenRole tenRole;

	Role(String idRole, TenRole tenRole) {
		this.idRole = idRole;
		this.tenRole = tenRole;
	}

	public String getIdRole() {
		return idRole;
	}

	public TenRole getTenRole() {
		return tenRole;
	}

	public void setIdRole(String idRole) {
		this.idRole = idRole;
	}

	public void setTenRole(TenRole tenRole) {
		this.tenRole = tenRole;
	}

	public enum TenRole {

		KHACH("khach"), TO_TRUONG("totrg"), KE_TOAN("ketoan");

		private final String tenRole;

		TenRole(String tenRole) {
			this.tenRole = tenRole;
		}

		@Override
		public String toString() {
			return tenRole;
		}

	}

}
