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
			e.printStackTrace();
			System.err.println(String.format("Failed to update %s", name));
			return 0;
		}
		return ketQua;
	}

	private void setData(PreparedStatement pst, int index, Object data) throws SQLException {
		int i = index + 1;
		if (data instanceof Date) {
			pst.setDate(i, (Date) data);
		} else if (data instanceof Boolean) {
			pst.setBoolean(i, (Boolean) data);
		} else if (data instanceof String) {
			pst.setString(i, (String) data);
		} else if (data instanceof Integer) {
			pst.setInt(i, (Integer) data);
		} else if (data instanceof Double) {
			pst.setDouble(i, (Double) data);
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
			System.err.println(String.format("Failed to delete %s", name));
			return 0;
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
			System.err.println(String.format("Failed to select %s", name));
			return null;
		}
		return ketQua;
	}

	public List<T> selectAll() {
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
			System.err.println(String.format("Failed to select %s", name));
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
				return String.format("%s%03d", prefix, rs.getInt(1) + 1);
			}

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			System.err.println(String.format("Failed to generate id %s", name));
			return null;
		}
		return null;
	}

	public T queryFirst(String[] names, Object[] matches) {
		return query(names, matches).get(0);
	}

	public List<T> query(String[] names, Object[] matches) {
		List<T> list = new ArrayList<>();
		StringBuilder sql = new StringBuilder("SELECT * FROM KhoanThu WHERE 1=1");

		for (String name : names) {
			sql.append(String.format(" AND %s = ?", name));
		}

		try (Connection conn = JDBCUtil.getConnection();
				PreparedStatement pst = conn.prepareStatement(sql.toString())) {
			for (int i = 0; i < matches.length; i++) {
				setData(pst, i, matches[i]);
			}
			try (ResultSet rs = pst.executeQuery()) {
				while (rs.next()) {
					list.add(newFromResultSet(rs));
				}
			}
		} catch (SQLException e) {
			System.err.println(String.format("Failed to query %s", name));
			return list;
		}
		return list;
	}

}
