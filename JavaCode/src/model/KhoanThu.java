package model;

import java.sql.Date;

public class KhoanThu {

	public static final int PAID = 0;
	public static final int PARTIAL_PAID = 1;
	public static final int UNPAID = 2;

	private int ID;
	private int dotThuID;
	private int hoKhauID;
	private int feeToPay;
	private int paidAmount;
	private int paidStatus;
	private Date dateOfPaid;

	public KhoanThu(int iD, int dotThuID, int hoKhauID, int feeToPay, int paidAmount, int paidStatus, Date dateOfPaid) {
		ID = iD;
		this.dotThuID = dotThuID;
		this.hoKhauID = hoKhauID;
		this.feeToPay = feeToPay;
		this.paidAmount = paidAmount;
		this.paidStatus = paidStatus;
		this.dateOfPaid = dateOfPaid;
	}

	public int getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(int paidAmount) {
		this.paidAmount = paidAmount;
	}

	public int getPaidStatus() {
		return paidStatus;
	}

	public void setPaidStatus(int paidStatus) {
		this.paidStatus = paidStatus;
	}

	public int getID() {
		return ID;
	}

	public int getDotThuID() {
		return dotThuID;
	}

	public int getHoKhauID() {
		return hoKhauID;
	}

	public int getFeeToPay() {
		return feeToPay;
	}

	public Date getDateOfPaid() {
		return dateOfPaid;
	}

}
