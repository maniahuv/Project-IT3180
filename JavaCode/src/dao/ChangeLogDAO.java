package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.ChangeLog;

public class ChangeLogDAO implements DataAccessObjectI<ChangeLog> {

	public static ChangeLogDAO instance = new ChangeLogDAO();

	@Override
	public int insert(ChangeLog changeLog) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO ChangeLog (ID,Time,Type,Details) VALUES (?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, changeLog.getID());
			pst.setDate(2, changeLog.getChangeTime());
			pst.setInt(3, changeLog.getChangeType());
			pst.setString(4, changeLog.getChangeDetails());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ketQua;
	}

	@Deprecated
	@Override
	public int update(ChangeLog changeLog) {
		return 0;
	}

	@Deprecated
	@Override
	public int delete(ChangeLog t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM ChangeLog WHERE ID=?";

			// Tao statement
			PreparedStatement pst1 = conn.prepareStatement(sql1);

			pst1.setInt(1, t.getID());

			ketQua = pst1.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}

	public ChangeLog selectByID(int id) {
		ChangeLog ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM ChangeLog WHERE ID='" + id + "'";

			// Tao statement
			PreparedStatement st = conn.prepareStatement(sql);

			ResultSet rs = st.executeQuery(sql);

			// Xu ly
			while (rs.next()) {
				ketQua = newFromResultSet(rs);
			}
			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		return ketQua;
	}

	@Override
	public List<ChangeLog> selectALL() {
		// TODO Auto-generated method stub
		List<ChangeLog> ketQua = new ArrayList<ChangeLog>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM ChangeLog ";

			// Tao statement
			PreparedStatement st = conn.prepareStatement(sql);

			ResultSet rs = st.executeQuery();

			// Xu ly
			while (rs.next()) {
				ketQua.add(newFromResultSet(rs));
			}

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		return ketQua;
	}

	private ChangeLog newFromResultSet(ResultSet rs) throws SQLException {
		return new ChangeLog(rs.getInt("ID"), rs.getDate("Time"), rs.getInt("Type"), rs.getString("Details"));
	}

	@Override
	public ChangeLog selectByID(ChangeLog t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<ChangeLog> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
