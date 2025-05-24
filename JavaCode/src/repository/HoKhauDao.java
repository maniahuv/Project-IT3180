package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.HoKhau;

public class HoKhauDao extends DataAccessObject<HoKhau> {

	public static HoKhauDao instance = new HoKhauDao();

	public HoKhauDao() {
		super("HoKhau");
	}

	@Override
	public int insert(HoKhau t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO HoKhau (ID,SoCanHo,DienTich,SoNguoi,ChuHo) VALUES (?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaHoKhau());
			pst.setString(2, t.getSoCanHo());
			pst.setDouble(3, t.getDienTich());
			pst.setInt(4, t.getSoNguoi());
			pst.setString(5, t.getChuHo());

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
	public HoKhau newFromResultSet(ResultSet rs) throws SQLException {
		return new HoKhau(rs.getString("ID"), rs.getString("SoCanHo"), rs.getDouble("DienTich"), rs.getInt("SoNguoi"),
				rs.getString("ChuHo"));
	}

}
