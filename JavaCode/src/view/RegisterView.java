package view;

import javax.swing.*;

import dao.AccountDAO;
import dao.SinhvienDAO;
import database.JDBCUtil;
import model.Sinhvien;
import model.*;

import java.awt.*;
import java.sql.Connection;
import java.sql.SQLException;

public class RegisterView extends JFrame {
    // Các thành phần giao diện
    private JTextField txtUsername, txtName, txtID, txtAge, txtAddress;
    private JPasswordField txtPassword;
    private JComboBox<String> comboGender;

    // Constructor khởi tạo giao diện
    public RegisterView() {
        setTitle("Đăng ký tài khoản");
        setSize(400, 400);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null); // Căn giữa màn hình
        setLayout(new GridLayout(8, 2, 10, 10)); // Lưới 8 hàng, 2 cột

        // Tạo các nhãn và ô nhập liệu
        JLabel lblUsername = new JLabel("Username:");
        JLabel lblPassword = new JLabel("Mật khẩu:");
        JLabel lblName = new JLabel("Họ tên:");
        JLabel lblID = new JLabel("Mã sinh viên:");
        JLabel lblAge = new JLabel("Tuổi:");
        JLabel lblGender = new JLabel("Giới tính:");
        JLabel lblAddress = new JLabel("Địa chỉ:");

        txtUsername = new JTextField();
        txtPassword = new JPasswordField();
        txtName = new JTextField();
        txtID = new JTextField();
        txtAge = new JTextField();
        txtAddress = new JTextField();
        comboGender = new JComboBox<>(new String[]{"Nam", "Nữ", "Khác"});

        // Thêm các thành phần vào layout
        add(lblUsername); add(txtUsername);
        add(lblPassword); add(txtPassword);
        add(lblName); add(txtName);
        add(lblID); add(txtID);
        add(lblAge); add(txtAge);
        add(lblGender); add(comboGender);
        add(lblAddress); add(txtAddress);

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
            String username = txtUsername.getText();
            String password = new String(txtPassword.getPassword());
            String name = txtName.getText();
            String id = txtID.getText();
            String age = txtAge.getText();
            String gender = comboGender.getSelectedItem().toString();
            String address = txtAddress.getText();

            // Kiểm tra dữ liệu: ID và tuổi phải là số, tên và địa chỉ không chứa số
            if (!isAllAlphabet(id) && !containsDigit(name) && !isAllAlphabet(age) && !containsDigit(address)) {

                // Tạo đối tượng sinh viên và lưu vào DB
                Sinhvien sv = new Sinhvien(Integer.parseInt(id), name, Integer.parseInt(age), gender, address);
                SinhvienDAO.getInstance().insert(sv);

                // Tạo tài khoản tương ứng
                Account ac = new Account(username, password, Integer.parseInt(id));
                AccountDAO.getInstance().insert(ac);

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

    // Kiểm tra xem chuỗi có phải toàn chữ cái không
    public boolean isAllAlphabet(String input) {
        for (char c : input.toCharArray()) {
            if (!Character.isLetter(c)) {
                return false;
            }
        }
        return true;
    }

    // Kiểm tra chuỗi có chứa chữ số không
    public boolean containsDigit(String input) {
        for (char c : input.toCharArray()) {
            if (Character.isDigit(c)) {
                return true;
            }
        }
        return false;
    }

    // Hàm main để chạy chương trình
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new RegisterView().setVisible(true));
    }
}
