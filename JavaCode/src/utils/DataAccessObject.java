package utils;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;

public abstract class DataAccessObject<T> {

	protected String prefix;
	protected String name;

	public DataAccessObject(String prefix, String name) {
		super();
		this.prefix = prefix;
		this.name = name;
	}

	public abstract int insert(T t);

	public int update(String id, String[] dataNames, Object[] data) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			StringBuilder sql = new StringBuilder(String.format("UPDATE %s SET %s=?", name, dataNames[0]));
			for (int i = 1; i < dataNames.length; i++) {
				sql.append(String.format(",%s=?", dataNames[i]));
			}
			sql.append(" WHERE ID=?");

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql.toString());
			for (int i = 0; i < data.length; i++) {
				setData(pst, i, data[i]);
			}
			setData(pst, data.length, id);

			ketQua = pst.executeUpdate();

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ketQua;
	}

	private void setData(PreparedStatement pst, int index, Object data) throws SQLException {
		if (data instanceof String) {
			pst.setString(index, (String) data);
		}
		if (data instanceof Integer) {
			pst.setInt(index, (Integer) data);
		}
		if (data instanceof Double) {
			pst.setDouble(index, (Double) data);
		}
		if (data instanceof Date) {
			pst.setDate(index, (Date) data);
		}
		if (data instanceof Boolean) {
			pst.setBoolean(index, (Boolean) data);
		}
	}

	public int delete(String id) {
		// TODO Auto-generated method stub
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql1 = String.format("DELETE FROM %s WHERE ID=?", name);

			// Tao statement
			PreparedStatement pst1 = conn.prepareStatement(sql1);

			pst1.setString(1, id);

			ketQua = pst1.executeUpdate();

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ketQua;
	}

	public T selectByID(String id) {
		T ketQua = null;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = String.format("SELECT * FROM %s WHERE ID='%s'", name, id);

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

	public List<T> selectALL() {
		List<T> ketQua = new ArrayList<T>();
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = String.format("SELECT * FROM %s ", name);

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
			e.printStackTrace();
			return null;
		}
		return ketQua;
	}

	public abstract T newFromResultSet(ResultSet rs) throws SQLException;

	public String generateID() {
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thucthi lenh sql
			String sql = String.format("SELECT COUNT(*) FROM %s ", name);

			// Tao statement
			PreparedStatement st = conn.prepareStatement(sql);

			ResultSet rs = st.executeQuery();

			// Xu ly
			while (rs.next()) {
				return String.format("%s%d", prefix, rs.getInt(1));
			}

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
		return null;
	}

}
