package model;

import java.sql.Date;

public class DotThu {

	private int ID;
	private Date startDate;
	private Date endDate;
	private int totalFee;
	private boolean onGoing;

	public DotThu(int iD, Date startDate, Date endDate, int totalFee, boolean onGoing) {
		ID = iD;
		this.startDate = startDate;
		this.endDate = endDate;
		this.totalFee = totalFee;
		this.onGoing = onGoing;
	}

	public int getTotalFee() {
		return totalFee;
	}

	public void setTotalFee(int totalFee) {
		this.totalFee = totalFee;
	}

	public int getID() {
		return ID;
	}

	public Date getStartDate() {
		return startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public boolean isOnGoing() {
		return onGoing;
	}

}
