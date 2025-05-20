package model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

public class HoKhau {

	private int ID;
	private String ownerName;
	private String ownerNID; // So CCCD
	private String phoneNumber;
	private String email;
	private String address;
	private Date dateOfRegistration;
	private boolean active;
	private List<NhanKhau> listNhauKhau = new ArrayList<NhanKhau>();

	public HoKhau(int iD, String ownerName, String ownerNID, String phoneNumber, String email, String address,
			Date dateOfRegistration, boolean active) {
		ID = iD;
		this.ownerName = ownerName;
		this.ownerNID = ownerNID;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.address = address;
		this.dateOfRegistration = dateOfRegistration;
		this.active = active;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public int getID() {
		return ID;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public String getOwnerNID() {
		return ownerNID;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public String getAddress() {
		return address;
	}

	public Date getDateOfRegistration() {
		return dateOfRegistration;
	}

	public List<NhanKhau> getListNhauKhau() {
		return listNhauKhau;
	}

}
