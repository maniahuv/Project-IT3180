package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.HoKhau;

public class HoKhauDAO implements DataAccessObjectI<HoKhau> {

	public static HoKhauDAO instance = new HoKhauDAO();

	@Override
	public int insert(HoKhau hoKhau) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO HoKhau (ID,OwnerName,OwnerNID,PhoneNumber,Email,"
					+ "Address,DateOfRegistration,Active) VALUES (?,?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setInt(1, hoKhau.getID());
			pst.setString(2, hoKhau.getOwnerName());
			pst.setString(3, hoKhau.getOwnerNID());
			pst.setString(4, hoKhau.getPhoneNumber());
			pst.setString(5, hoKhau.getEmail());
			pst.setString(6, hoKhau.getAddress());
			pst.setDate(7, hoKhau.getDateOfRegistration());
			pst.setBoolean(8, hoKhau.isActive());

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
	public int update(HoKhau hoKhau) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "UPDATE HoKhau SET Active=? WHERE (ID)=(?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setBoolean(1, hoKhau.isActive());
			pst.setInt(2, hoKhau.getID());

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
	public int delete(HoKhau t) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = "DELETE FROM HoKhau WHERE (ID)=(?)";

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

	public HoKhau selectByID(int id) {
		HoKhau ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM HoKhau WHERE (ID)=('" + id + "')";

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
	public List<HoKhau> selectALL() {
		// TODO Auto-generated method stub
		List<HoKhau> ketQua = new ArrayList<HoKhau>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = "SELECT * FROM HoKhau ";

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

	private HoKhau newFromResultSet(ResultSet rs) throws SQLException {
		return new HoKhau(rs.getInt("ID"), rs.getString("OwnerName"), rs.getString("OwnerNID"),
				rs.getString("PhoneNumber"), rs.getString("Email"), rs.getString("Address"),
				rs.getDate("DateOfRegistration"), rs.getBoolean("Active"));
	}

	@Override
	public HoKhau selectByID(HoKhau t) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<HoKhau> selectALL(String condition) {
		// TODO Auto-generated method stub
		return null;
	}

}
