package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

// Lớp Menu giao diện chính của hệ thống
public class Menu extends JFrame {

    public Menu() {
        // Tạo cửa sổ chính của giao diện Menu
        setTitle("Quản Lý Hệ Thống");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(500, 400);
        setLocationRelativeTo(null);
        setLayout(new GridLayout(6, 1, 10, 10));
        getContentPane().setBackground(new Color(200, 230, 250));

        // Đặt màu nền cho cửa sổ
        getContentPane().setBackground(new Color(200, 230, 250));

        // Font chữ cho các nút
        Font buttonFont = new Font("Arial", Font.BOLD, 16);

        // Khởi tạo các nút chức năng
        JButton btnQLSV = new JButton("QUẢN LÝ SINH VIÊN");
        JButton btnQLMonHoc = new JButton("QUẢN LÝ MÔN HỌC");
        JButton btnQLGiangVien = new JButton("QUẢN LÝ GIẢNG VIÊN");
        JButton btnLopHoc = new JButton("LỚP HỌC");
        JButton btnDiem = new JButton("ĐIỂM");
        JButton btnDangXuat = new JButton("ĐĂNG XUẤT");

        // Mảng chứa các nút để xử lý định dạng chung
        JButton[] buttons = {btnQLSV, btnQLMonHoc, btnQLGiangVien, btnLopHoc, btnDiem, btnDangXuat};
        for (JButton btn : buttons) {
            btn.setFont(buttonFont); // Font chữ
            btn.setBackground(new Color(100, 149, 237)); // Màu nền xanh
            btn.setForeground(Color.WHITE); // Chữ trắng
            btn.setFocusPainted(false); // Bỏ viền khi focus
            btn.setBorder(BorderFactory.createLineBorder(Color.BLACK, 2)); // Viền đen 2px
        }

        // Sự kiện cho nút Quản lý sinh viên
        btnQLSV.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                QLSVView qlsvView = new QLSVView();
                qlsvView.setVisible(true); // Hiển thị giao diện quản lý sinh viên
            }
        });

        btnDiem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                
                new ScoreTableView().setVisible(true); // Hiển thị giao diện quản lý sinh viên
            }
        });

        btnQLGiangVien.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                
                new MainFrame().setVisible(true); // Hiển thị giao diện quản lý sinh viên
            }
        });

        // Sự kiện cho nút Quản lý môn học
        btnQLMonHoc.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                RegisterSubjectView registerSubjectView = new RegisterSubjectView();
                registerSubjectView.setVisible(true); // Hiển thị giao diện môn học
                registerSubjectView.renderAllSubjects(); // Gọi phương thức hiển thị dữ liệu môn học
            }
        });

        // Sự kiện cho nút Đăng xuất
        btnDangXuat.addActionListener(e -> {
            // Hiển thị hộp thoại xác nhận đăng xuất
            int confirm = JOptionPane.showConfirmDialog(this, // Căn giữa trên cửa sổ hiện tại
            "Bạn có chắc muốn đăng xuất?","Xác nhận",JOptionPane.YES_NO_OPTION,JOptionPane.QUESTION_MESSAGE);
            if (confirm == JOptionPane.YES_OPTION) {
                this.setVisible(false);
                this.dispose();
                new LogInView().setVisible(true);

            }
        });

        // Thêm các nút vào cửa sổ
        for (JButton btn : buttons) {
            add(btn);
        }

        setVisible(true); // Hiển thị giao diện
    }
}
