package model;

public class Role {

	private String idRole;
	private int tenRole;

	public Role(String idRole, int tenRole) {
		this.idRole = idRole;
		this.tenRole = tenRole;
	}

	public String getIdRole() {
		return idRole;
	}

	public int getTenRole() {
		return tenRole;
	}

	public void setIdRole(String idRole) {
		this.idRole = idRole;
	}

	public void setTenRole(int tenRole) {
		this.tenRole = tenRole;
	}

	public static class TenRole {

		public static final int KHACH = 0;
		public static final int TO_TRUONG = 1;
		public static final int KE_TOAN = 2;

		public static String toString(int id) {
			switch (id) {
			case KHACH:
				return "khach";
			case TO_TRUONG:
				return "totrg";
			case KE_TOAN:
				return "ketoan";
			default:
				return "";
			}
		}

	}

}
