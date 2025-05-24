package model;

public class ThongKeDotThu {
	 private int totalDotThu;
	    private int soDangDienRa;
	    private int soDaKetThuc;

	    public ThongKeDotThu(int totalDotThu, int soDangDienRa, int soDaKetThuc) {
	        this.totalDotThu    = totalDotThu;
	        this.soDangDienRa   = soDangDienRa;
	        this.soDaKetThuc    = soDaKetThuc;
	    }

	    public int getTotalDotThu() {
	        return totalDotThu;
	    }

	    public int getSoDangDienRa() {
	        return soDangDienRa;
	    }

	    public int getSoDaKetThuc() {
	        return soDaKetThuc;
	    }

	    @Override
	    public String toString() {
	        return "ThongKeDotThu{" +
	               "totalDotThu=" + totalDotThu +
	               ", soDangDienRa=" + soDangDienRa +
	               ", soDaKetThuc=" + soDaKetThuc +
	               '}';
	    }
}
