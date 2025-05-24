package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.Quyen;

public class QuyenDao extends DataAccessObject<Quyen> {

	public static QuyenDao instance = new QuyenDao();

	public QuyenDao() {
		super("Quyen");
	}

	@Override
	public int insert(Quyen t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO Quyen (ID,TenQuyen) VALUES (?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getIdQuyen());
			pst.setInt(2, t.getTenQuyen());

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
	public Quyen newFromResultSet(ResultSet rs) throws SQLException {
		return new Quyen(rs.getString("ID"), rs.getInt("TenQuyen"));
	}

}
