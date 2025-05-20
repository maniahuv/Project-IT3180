package model;

public class TaiKhoan {

	private int ID;
	private String email;
	private int password;
	private String name;
	private String nhanKhauID;
	private int accessLevel; // cap truy cap
	private String phoneNumber;

	public TaiKhoan(int ID, String email, int password, String name, String nhanKhauID, int accessLevel,
			String phoneNumber) {
		this.ID = ID;
		this.email = email;
		this.password = password;
		this.name = name;
		this.nhanKhauID = nhanKhauID;
		this.accessLevel = accessLevel;
		this.phoneNumber = phoneNumber;
	}

	public int getPassword() {
		return password;
	}

	public void setPassword(int password) {
		this.password = password;
	}

	public int getID() {
		return ID;
	}

	public String getEmail() {
		return email;
	}

	public String getName() {
		return name;
	}

	public String getNhanKhauID() {
		return nhanKhauID;
	}

	public int getAccessLevel() {
		return accessLevel;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

}
