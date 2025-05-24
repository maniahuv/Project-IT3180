package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.DotThu;

public class DotThuDao extends DataAccessObject<DotThu> {

	public static DotThuDao instance = new DotThuDao();

	public DotThuDao() {
		super("DotThu");
	}

	@Override
	public int insert(DotThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO DotThu (ID,TenDotThu,ThoiGianBatDau,ThoiGianKetThuc,MoTa,TrangThai) VALUES (?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaDotThu());
			pst.setString(2, t.getTenDotThu());
			pst.setDate(3, t.getThoiGianBatDau());
			pst.setDate(4, t.getThoiGianKetThuc());
			pst.setString(5, t.getMoTa());
			pst.setInt(6, t.getTrangThai());

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
	public DotThu newFromResultSet(ResultSet rs) throws SQLException {
		return new DotThu(rs.getString("ID"), rs.getString("TenDotThu"), rs.getDate("ThoiGianBatDau"),
				rs.getDate("ThoiGianKetThuc"), rs.getString("MoTa"), rs.getInt("TrangThai"));
	}

}
