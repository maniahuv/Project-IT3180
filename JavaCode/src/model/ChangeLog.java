package model;

import java.sql.Date;

public class ChangeLog {

	public static final int CT_TAI_KHOAN = 0;
	public static final int CT_NHAN_KHAU = 1;
	public static final int CT_HO_KHAU = 2;
	public static final int CT_DOT_THU = 3;
	public static final int CT_KHOAN_THU = 4;

	private int ID;
	private Date changeTime;
	private int changeType;
	private String changeDetails;

	public ChangeLog(int iD, Date changeTime, int changeType, String changeDetails) {
		ID = iD;
		this.changeTime = changeTime;
		this.changeType = changeType;
		this.changeDetails = changeDetails;
	}

	public int getID() {
		return ID;
	}

	public Date getChangeTime() {
		return changeTime;
	}

	public int getChangeType() {
		return changeType;
	}

	public String getChangeDetails() {
		return changeDetails;
	}

}
