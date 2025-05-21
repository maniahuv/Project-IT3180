package view;

import javax.swing.*;
import database.JDBCUtil;
import java.awt.*;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LogInView extends JFrame {

	private static final long serialVersionUID = 5381873119848065107L;

	private JTextField txtEmail;
	private JPasswordField txtPassword;
	public JButton btnLogin;

	// Constructor tạo giao diện đăng nhập
	public LogInView() {
		setTitle("Đăng nhập hệ thống"); // Tiêu đề cửa sổ
		setSize(400, 130); // Kích thước cửa sổ
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // Thoát chương trình khi đóng
		setLocationRelativeTo(null); // Hiển thị ở giữa màn hình
		setLayout(new GridLayout(3, 2, 10, 10)); // Bố cục lưới: 3 hàng, 2 cột, khoảng cách 10px

		// Tạo label cho tài khoản và mật khẩu
		JLabel lblEmail = new JLabel("Email:");
		JLabel lblPassword = new JLabel("Mật khẩu:");

		// Tạo ô nhập liệu cho username và password
		txtEmail = new JTextField();
		txtPassword = new JPasswordField();

		// Tạo nút Đăng nhập và Đăng ký
		JButton btnLogin = new JButton("Đăng nhập");
		JButton btnRegister = new JButton("Đăng ký");

		// Thêm các thành phần vào giao diện (theo thứ tự GridLayout)
		add(lblEmail);
		add(txtEmail);
		add(lblPassword);
		add(txtPassword);
		add(btnLogin);
		add(btnRegister);

		// Gán hành động cho nút Đăng nhập
		btnLogin.addActionListener(e -> authenticateUser());

		// Gán hành động cho nút Đăng ký (mở form đăng ký)
		btnRegister.addActionListener(e -> new RegisterTaiKhoanView().setVisible(true));
	}

	// Phương thức xác thực tài khoản người dùng
	private void authenticateUser() {
		// Lấy dữ liệu từ các ô nhập
		String email = getEmail();
		int password;
		try {
			password = Integer.parseInt(getPassword());
		} catch (NumberFormatException e) {
			JOptionPane.showMessageDialog(null, "Sai email hoặc mật khẩu!", "ERROR", JOptionPane.ERROR_MESSAGE);
			return;
		}

		try (Connection conn = JDBCUtil.getConnection()) {
			// Câu lệnh SQL kiểm tra thông tin đăng nhập
			String sql = "SELECT * FROM TaiKhoan WHERE Email = ? AND Password = ?";
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, email);
			pstmt.setInt(2, password);

			ResultSet rs = pstmt.executeQuery();

			// Nếu có bản ghi => Đăng nhập thành công
			if (rs.next()) {
				JOptionPane.showMessageDialog(null, "Đăng nhập thành công!", "SUCCESS",
						JOptionPane.INFORMATION_MESSAGE);
				LogInView.this.dispose(); // Đóng form đăng nhập
				// Mở form main
				new Menu().setVisible(true);
			} else {
				// Sai thông tin đăng nhập
				JOptionPane.showMessageDialog(null, "Sai email hoặc mật khẩu!", "ERROR", JOptionPane.ERROR_MESSAGE);
			}
		} catch (SQLException ex) {
			ex.printStackTrace();
			JOptionPane.showMessageDialog(null, "Lỗi đăng nhập!", "ERROR", JOptionPane.ERROR_MESSAGE);
		}
	}

	public String getEmail() {
		return txtEmail.getText();
	}

	public String getPassword() {
		return new String(txtPassword.getPassword());
	}

	// Gán hành động riêng bên ngoài cho nút đăng nhập (nếu muốn)
	public void setLoginListener(ActionListener listener) {
		btnLogin.addActionListener(listener);
	}

	// Hàm main để chạy form này trực tiếp (test)
	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> new LogInView().setVisible(true));
	}
}
