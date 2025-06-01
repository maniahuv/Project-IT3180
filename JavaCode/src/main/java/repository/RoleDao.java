package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Role;
import utils.DataAccessObject;
import utils.JDBCUtil;

public class RoleDao extends DataAccessObject<Role> {

	public static RoleDao instance = new RoleDao();

	public RoleDao() {
		super("Ro", "Role");
	}

	@Override
	public int insert(Role t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO Role (ID,TenRole) VALUES (?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getIdRole());
			pst.setInt(2, t.getTenRole());

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
	public Role newFromResultSet(ResultSet rs) throws SQLException {
		return new Role(rs.getString("ID"), rs.getInt("TenRole"));
	}

}
