package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.TaiKhoan;

public class TaiKhoanDAO implements DataAccessObjectI<TaiKhoan> {

	public static TaiKhoanDAO instance = new TaiKhoanDAO();

	@Override
	public int insert(TaiKhoan taiKhoan) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO TaiKhoan (ID,Email,Password,Name,NhanKhauID,"
					+ "AccessLevel,PhoneNumber) VALUES (?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, taiKhoan.getID());
			pst.setString(2, taiKhoan.getEmail());
			pst.setInt(3, taiKhoan.getPassword());
			pst.setString(4, taiKhoan.getName());
			pst.setInt(5, taiKhoan.getNhanKhauID());
			pst.setInt(6, taiKhoan.getAccessLevel());
			pst.setString(7, taiKhoan.getPhoneNumber());

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
	public int update(TaiKhoan taiKhoan) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "UPDATE TaiKhoan SET Password=?,AccessLevel=? WHERE ID=?";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, taiKhoan.getPassword());
			pst.setInt(2, taiKhoan.getAccessLevel());
			pst.setInt(3, taiKhoan.getID());

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
	public int delete(TaiKhoan t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM TaiKhoan WHERE ID=?";

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

	public TaiKhoan selectByID(int id) {
		TaiKhoan ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM TaiKhoan WHERE ID='" + id + "'";

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
	public List<TaiKhoan> selectALL() {
		// TODO Auto-generated method stub
		List<TaiKhoan> ketQua = new ArrayList<TaiKhoan>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM TaiKhoan ";

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

	private TaiKhoan newFromResultSet(ResultSet rs) throws SQLException {
		return new TaiKhoan(rs.getInt("ID"), rs.getString("Email"), rs.getInt("Password"), rs.getString("Name"),
				rs.getInt("NhanKhauID"), rs.getInt("AccessLevel"), rs.getString("PhoneNumber"));
	}

	@Override
	public TaiKhoan selectByID(TaiKhoan t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<TaiKhoan> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
