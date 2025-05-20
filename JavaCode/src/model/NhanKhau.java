package model;

import java.sql.Date;

public class NhanKhau {

	private int ID;
	private String name;
	private String nationalID;
	private Date dateOfBirth;
	private boolean male;
	private String relationToOwner;
	private int hoKhauID;
	private String occupation;
	private boolean active;

	public NhanKhau(int iD, String name, String nationalID, Date dateOfBirth, boolean male, String relationToOwner,
			int hoKhauID, String occupation, boolean active) {
		ID = iD;
		this.name = name;
		this.nationalID = nationalID;
		this.dateOfBirth = dateOfBirth;
		this.male = male;
		this.relationToOwner = relationToOwner;
		this.hoKhauID = hoKhauID;
		this.occupation = occupation;
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

	public String getName() {
		return name;
	}

	public String getNationalID() {
		return nationalID;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public boolean isMale() {
		return male;
	}

	public String getRelationToOwner() {
		return relationToOwner;
	}

	public int getHoKhauID() {
		return hoKhauID;
	}

	public String getOccupation() {
		return occupation;
	}

}
