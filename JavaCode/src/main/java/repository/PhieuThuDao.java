package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.JDBCUtil;
import model.PhieuThu;
import utils.DataAccessObject;

public class PhieuThuDao extends DataAccessObject<PhieuThu> {

	public static PhieuThuDao instance = new PhieuThuDao();

	public PhieuThuDao() {
		super("PT", "PhieuThu");
	}

	@Override
	public int insert(PhieuThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO PhieuThu (ID,MaHoKhau,MaDotThu,NgayThu,TongTien,TrangThai,DuongDanDuongTep) VALUES (?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaPhieuThu());
			pst.setString(2, t.getMaHoKhau());
			pst.setString(3, t.getMaDotThu());
			pst.setDate(4, t.getNgayThu());
			pst.setDouble(5, t.getTongTien());
			pst.setInt(6, t.getTrangThai());
			pst.setString(7, t.getDuongDanDuongTep());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			System.err.println(String.format("Failed to update %s", name));
			return 0;
		}
		return ketQua;
	}

	@Override
	public PhieuThu newFromResultSet(ResultSet rs) throws SQLException {
		return new PhieuThu(rs.getString("ID"), rs.getString("MaHoKhau"), rs.getString("MaDotThu"),
				rs.getDate("NgayThu"), rs.getDouble("TongTien"), rs.getInt("TrangThai"),
				rs.getString("DuongDanDuongTep"));
	}

}
