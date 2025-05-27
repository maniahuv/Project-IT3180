package database;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCUtil {

	public static Connection getConnection() {
		Connection c = null;
		try {
			// Dang ky driver
			Class.forName("com.mysql.cj.jdbc.Driver");

			// Cac thong so
			String DB_URL = "jdbc:mysql://localhost:3306/it3180";
			String USER_NAME = "root";
			String PASSWORD = "";

			// Tao ket noi
			c = DriverManager.getConnection(DB_URL, USER_NAME, PASSWORD);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return c;

	}

	public static void closeConnetion(Connection c) {
		try {
			if (c != null) {
				c.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void printInfo(Connection c) {
		try {
			if (c != null) {
				DatabaseMetaData mtdt = c.getMetaData();
				System.out.println(mtdt.getDatabaseProductName());
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
