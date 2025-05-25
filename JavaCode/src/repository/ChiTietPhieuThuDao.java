package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.JDBCUtil;
import model.ChiTietPhieuThu;
import utils.DataAccessObject;

public class ChiTietPhieuThuDao extends DataAccessObject<ChiTietPhieuThu> {

	public static ChiTietPhieuThuDao instance = new ChiTietPhieuThuDao();

	public ChiTietPhieuThuDao() {
		super("DPT", "ChiTietPhieuThu");
	}

	@Override
	public int insert(ChiTietPhieuThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO ChiTietPhieuThu (ID,MaKhoanThu,SoTienThu,GhiChu) VALUES (?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaPhieuThu());
			pst.setString(2, t.getMaKhoanThu());
			pst.setString(3, t.getSoTienThu());
			pst.setString(4, t.getGhiChu());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ketQua;
	}

	@Override
	public ChiTietPhieuThu newFromResultSet(ResultSet rs) throws SQLException {
		return new ChiTietPhieuThu(rs.getString("ID"), rs.getString("MaKhoanThu"), rs.getString("SoTienThu"),
				rs.getString("GhiChu"));
	}

}
