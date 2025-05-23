package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.KhoanThu;

public class KhoanThuDAO implements DataAccessObjectI<KhoanThu> {

	public static KhoanThuDAO instance = new KhoanThuDAO();

	@Override
	public int insert(KhoanThu khoanThu) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO KhoanThu (ID,DotThuID,HoKhauID,FeeToPay,PaidAmount,PaidStatus,DateOfPaid)"
					+ " VALUES (?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, khoanThu.getID());
			pst.setInt(2, khoanThu.getDotThuID());
			pst.setInt(3, khoanThu.getHoKhauID());
			pst.setInt(4, khoanThu.getFeeToPay());
			pst.setInt(5, khoanThu.getPaidAmount());
			pst.setInt(6, khoanThu.getPaidStatus());
			pst.setDate(7, khoanThu.getDateOfPaid());

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
	public int update(KhoanThu khoanThu) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "UPDATE KhoanThu SET PaidAmount=?,PaidStatus=?,DateOfPaid=? WHERE ID=?";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, khoanThu.getPaidAmount());
			pst.setInt(2, khoanThu.getPaidStatus());
			pst.setDate(3, khoanThu.getDateOfPaid());
			pst.setInt(4, khoanThu.getID());

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
	public int delete(KhoanThu t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM KhoanThu WHERE ID=?";

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

	public KhoanThu selectByID(int id) {
		KhoanThu ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM KhoanThu WHERE ID='" + id + "'";

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
	public List<KhoanThu> selectALL() {
		// TODO Auto-generated method stub
		List<KhoanThu> ketQua = new ArrayList<KhoanThu>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM KhoanThu ";

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

	private KhoanThu newFromResultSet(ResultSet rs) throws SQLException {
		return new KhoanThu(rs.getInt("ID"), rs.getInt("DotThuID"), rs.getInt("HoKhauID"), rs.getInt("FeeToPay"),
				rs.getInt("PaidAmount"), rs.getInt("PaidStatus"), rs.getDate("DateOfPaid"));
	}

	@Override
	public KhoanThu selectByID(KhoanThu t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<KhoanThu> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
