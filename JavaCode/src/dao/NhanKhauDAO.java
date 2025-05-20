package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.NhanKhau;

public class NhanKhauDAO implements DataAccessObjectI<NhanKhau> {

	public static NhanKhauDAO instance = new NhanKhauDAO();

	@Override
	public int insert(NhanKhau nhanKhau) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO NhanKhau (ID,Name,NID,DateOfBirth,Male,"
					+ "Relation,HoKhauID,Occupation,Active) VALUES (?,?,?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, nhanKhau.getID());
			pst.setString(2, nhanKhau.getName());
			pst.setString(3, nhanKhau.getNationalID());
			pst.setDate(4, nhanKhau.getDateOfBirth());
			pst.setBoolean(5, nhanKhau.isMale());
			pst.setString(6, nhanKhau.getRelationToOwner());
			pst.setInt(7, nhanKhau.getHoKhauID());
			pst.setString(8, nhanKhau.getOccupation());
			pst.setBoolean(9, nhanKhau.isActive());

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
	public int update(NhanKhau nhanKhau) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "UPDATE NhanKhau SET Active=? WHERE ID=?";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setBoolean(1, nhanKhau.isActive());
			pst.setInt(2, nhanKhau.getID());

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
	public int delete(NhanKhau t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM NhanKhau WHERE ID=?";

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

	public NhanKhau selectByID(int id) {
		NhanKhau ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM NhanKhau WHERE ID='" + id + "'";

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
	public List<NhanKhau> selectALL() {
		// TODO Auto-generated method stub
		List<NhanKhau> ketQua = new ArrayList<NhanKhau>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM NhanKhau ";

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

	private NhanKhau newFromResultSet(ResultSet rs) throws SQLException {
		return new NhanKhau(rs.getInt("ID"), rs.getString("Name"), rs.getString("NID"), rs.getDate("DateOfBirth"),
				rs.getBoolean("Male"), rs.getString("Relation"), rs.getInt("HoKhauID"), rs.getString("Occupation"),
				rs.getBoolean("Active"));
	}

	@Override
	public NhanKhau selectByID(NhanKhau t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<NhanKhau> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
