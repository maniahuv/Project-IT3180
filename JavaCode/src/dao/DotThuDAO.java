package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.DotThu;

public class DotThuDAO implements DataAccessObjectI<DotThu> {

	public static DotThuDAO instance = new DotThuDAO();

	@Override
	public int insert(DotThu dotThu) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO DotThu (ID,StartDate,EndDate,TotalFee,OnGoing) VALUES (?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, dotThu.getID());
			pst.setDate(2, dotThu.getStartDate());
			pst.setDate(3, dotThu.getEndDate());
			pst.setInt(4, dotThu.getTotalFee());
			pst.setBoolean(5, dotThu.isOnGoing());

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
	public int update(DotThu dotThu) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "UPDATE DotThu SET TotalFee=?,OnGoing=? WHERE ID=?";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, dotThu.getTotalFee());
			pst.setBoolean(2, dotThu.isOnGoing());
			pst.setInt(3, dotThu.getID());

			ketQua = pst.executeUpdate();
//					System.out.println(sql);
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return 0;
	}

	@Override
	public int delete(DotThu t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM DotThu WHERE ID=?";

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

	public DotThu selectByID(int id) {
		DotThu ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM DotThu WHERE ID='" + id + "'";

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
	public List<DotThu> selectALL() {
		// TODO Auto-generated method stub
		List<DotThu> ketQua = new ArrayList<DotThu>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM DotThu ";

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

	private DotThu newFromResultSet(ResultSet rs) throws SQLException {
		return new DotThu(rs.getInt("ID"), rs.getDate("StartDate"), rs.getDate("StartEndDate"), rs.getInt("TotalFee"),
				rs.getBoolean("OnGoing"));
	}

	@Override
	public DotThu selectByID(DotThu t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<DotThu> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
