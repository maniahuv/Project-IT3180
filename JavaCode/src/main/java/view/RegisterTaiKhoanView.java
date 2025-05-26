package view;

import java.awt.GridLayout;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.regex.Pattern;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

import dao.TaiKhoanDAO;
import database.JDBCUtil;
import model.TaiKhoan;
import utils.Validator;

public class RegisterTaiKhoanView extends JFrame {

	private static final long serialVersionUID = -8085371793003211252L;
	// Các thành phần giao diện
	private JTextField txtEmail, txtName, txtNhanKhauID, txtPhoneNumber;
	private JPasswordField txtPassword;

	// Constructor khởi tạo giao diện
	public RegisterTaiKhoanView() {
		setTitle("Đăng ký tài khoản");
		setSize(400, 250);
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		setLocationRelativeTo(null); // Căn giữa màn hình
		setLayout(new GridLayout(6, 2, 10, 10)); // Lưới 6 hàng, 2 cột

		// Tạo các nhãn và ô nhập liệu
		JLabel lblEmail = new JLabel("Email:");
		JLabel lblPassword = new JLabel("Mật khẩu:");
		JLabel lblName = new JLabel("Họ tên:");
		JLabel lblNhanKhauID = new JLabel("Mã nhân khẩu:");
		JLabel lblPhoneNumber = new JLabel("Tuổi:");

		txtEmail = new JTextField();
		txtPassword = new JPasswordField();
		txtName = new JTextField();
		txtNhanKhauID = new JTextField();
		txtPhoneNumber = new JTextField();

		// Thêm các thành phần vào layout
		add(lblEmail);
		add(txtEmail);
		add(lblPassword);
		add(txtPassword);
		add(lblName);
		add(txtName);
		add(lblNhanKhauID);
		add(txtNhanKhauID);
		add(lblPhoneNumber);
		add(txtPhoneNumber);

		// Nút chức năng
		JButton btnRegister = new JButton("Đăng ký");
		JButton btnBack = new JButton("Quay lại");

		add(btnBack);
		add(btnRegister);

		// Xử lý khi bấm "Quay lại"
		btnBack.addActionListener(e -> {
			this.dispose(); // Đóng form hiện tại
			// Có thể mở form login nếu muốn
		});

		// Xử lý khi bấm "Đăng ký"
		btnRegister.addActionListener(e -> registerUser());
	}

	// Hàm xử lý đăng ký người dùng
	private void registerUser() {
		try (Connection conn = JDBCUtil.getConnection()) {
			// Lấy dữ liệu từ giao diện
			String email = txtEmail.getText();
			String password = new String(txtPassword.getPassword());
			String name = txtName.getText();
			String nhanKhauID = txtNhanKhauID.getText();
			String phoneNumber = txtPhoneNumber.getText();

			// Check validity
			if (validEmail(email) && validPassword(password) && validNhanKhauID(nhanKhauID)
					&& validPhoneNumber(phoneNumber)) {

				// Tạo tài khoản tương ứng
				TaiKhoan ac = new TaiKhoan(genID(), email, Integer.parseInt(password), name,
						Integer.parseInt(nhanKhauID), TaiKhoan.NO_ACCESS, phoneNumber);
				TaiKhoanDAO.instance.insert(ac);

				// Thông báo thành công
				JOptionPane.showMessageDialog(null, "Đăng ký thành công!");
				this.dispose(); // Đóng form
			} else {
				// Nếu dữ liệu không hợp lệ
				JOptionPane.showMessageDialog(null, "Đăng kí thất bại!");
			}

		} catch (SQLException ex) {
			ex.printStackTrace();
			JOptionPane.showMessageDialog(null, "Lỗi đăng ký!");
		}
	}

	private int genID() {
		return 0;
	}

	public boolean validEmail(String email) {
		String regexPattern = "^(.+)@(\\S+)$";
		return Pattern.compile(regexPattern).matcher(email).matches();
	}

	public boolean validPassword(String password) {
		return password.length() == 6 && Validator.isAllDigit(password);
	}

	public boolean validPhoneNumber(String phoneNumber) {
		return Validator.isAllDigit(phoneNumber);
	}

	public boolean validNhanKhauID(String id) {
		if (!Validator.isAllDigit(id)) {
			return false;
		}
		try (Connection conn = JDBCUtil.getConnection()) {
			// Câu lệnh SQL kiểm tra ID
			String sql = "SELECT * FROM NhanKhau WHERE ID = ?";
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, Integer.parseInt(id));

			ResultSet rs = pstmt.executeQuery();

			// Nếu có bản ghi => valid
			return rs.next();
		} catch (SQLException ex) {
			ex.printStackTrace();
			return false;
		}
	}

	// Hàm main để chạy chương trình
	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> new RegisterTaiKhoanView().setVisible(true));
	}
}
